import { db } from "@/db"
import { books, SelectBook } from "@/db/schema/books"
import { InsertInsight, insights } from "@/db/schema/insights"
import { logs } from "@/db/schema/logs"
import { parse } from "date-fns"
import { configDotenv } from "dotenv"
import { eq } from "drizzle-orm"
import _ from "lodash"
import OpenAI from "openai"
import { z } from "zod"

/**
 * Book we want to use AI to determine new insights for.
 * If insights exist, we'll attempt t
 * @param book Book to process insights for
 *
 * Resources:
 * - [DEPRECATED] https://js.langchain.com/v0.2/docs/how_to/structured_output/
 * - https://platform.openai.com/docs/guides/structured-outputs/introduction
 */
configDotenv({ path: `.env.${process.env.NODE_ENV ?? "local"}` })
const OPENAI_ASSISTANT = "asst_dkgC9ir5CrvH45nYmTEnPoyY"

// These Zod objects are just here so we can extract the types. The actual JSON schema is specified
// in the assistant we're using
const insightSchema = z.object({
  date: z.string(),
  name: z.string(),
  description: z.string(),
  wikipedia_link: z.string(),
})
const bookInsightsSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  insights: z.array(insightSchema),
  history_book: z
    .boolean()
    .describe(
      "True if and only if the book is primarily a history book, and not a work of fiction"
    ),
})

type BookInsights = z.infer<typeof bookInsightsSchema>
type Insight = z.infer<typeof insightSchema>

type ParsedInsightDate = {
  date: Date | null
  year: number | null
  is_bc: boolean
}

const DATE_FORMATS = ["MM/dd/yyyy", "yyyy", "yyyy G"]

/**
 * Parses a date string in multiple formats.
 *
 * @param dateString The date string to parse.
 * @returns The parsed Date object, or the year or null. Note that year (from date or actual year val) will be
 *  negative if the date is actually BC.
 */
export function parseDate(
  dateString: string,
  referenceDate: Date | undefined = undefined
): ParsedInsightDate {
  // Helper
  const isValidDate = (d: Date) => d instanceof Date && !isNaN(d)

  // Remove commas, which sometimes appear in years
  dateString = dateString.replace(/,/g, "")
  let dateObj: Date | undefined = undefined
  for (const format of DATE_FORMATS) {
    dateObj = parse(dateString, format, new Date())
    if (isValidDate(dateObj)) {
      const isBC = dateObj.getFullYear() < 0
      const year = Math.abs(dateObj.getFullYear())
      dateObj.setFullYear(year)
      return { date: format.includes("dd") ? dateObj : null, year, is_bc: isBC }
    }
  }
  return { date: null, year: null, is_bc: false }
}

export async function ProcessBookInsights(book: SelectBook) {
  console.log("Processing Book Insights")

  // Get existing insights. Try to have AI NOT use them
  const existingInsights = await db
    .select()
    .from(insights)
    .where(eq(insights.book_id, book.id))
  const existingInsightWikipedias = _.map(existingInsights, "wikipedia_link")
  let message = `${book.title} by ${book.author}`
  if (existingInsights) {
    message += "\nDo not include these events in your response:"
    existingInsights.forEach((i) => {
      message += `\n- ${i.name}`
    })
  }

  // Do this with a thread. Test and see if we can put multiple books on the thread as separate messages and
  // get responses back for each
  console.log("Running insights assistant")
  const startTime = new Date()
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const run = await openai.beta.threads.createAndRunPoll({
    assistant_id: OPENAI_ASSISTANT,
    thread: {
      messages: [{ role: "user", content: message }],
    },
  })
  const duration = new Date().getTime() - startTime.getTime() // Miliseconds
  console.log(`Run Status: ${run.status}. Duration: ${duration}ms`)

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id)
    // Log results
    const logInsert = await db.insert(logs).values({
      log_type: "ai.insights",
      data: { response: messages, prompt: message },
    })

    if (messages.data.length != 2) {
      console.log(`Unexpected number of messages: ${messages.data.length}`)
      throw new Error(`Unexpected number of messages: ${messages.data.length}`)
    }

    const data = messages.data[0].content[0].text.value
    const insightsResponse: BookInsights = JSON.parse(data)
    console.log(
      `Success. ${insightsResponse.insights.length} insights found for ${book.title}`
    )
    let insertInsights: InsertInsight[] = insightsResponse.insights.map((i) => {
      const insight: InsertInsight = {
        name: i.name,
        description: i.description,
        wikipedia_link: i.wikipedia_link,
        book_id: book.id,
      }
      let eventDate = parseDate(i.date)
      if (eventDate.year !== null) {
        insight.year = eventDate.year.toString()
        insight.is_bc = eventDate.is_bc
        insight.date = eventDate.date?.toISOString()
      }
      return insight
    })

    // If we're adding new insights, we only include those we don't already ahve
    if (existingInsightWikipedias) {
      insertInsights = insertInsights.filter(
        (i) => !existingInsightWikipedias.includes(i.wikipedia_link ?? "")
      )
    }

    console.log(`Inserting ${insertInsights.length} insights`)
    console.debug(insertInsights)
    await db.insert(insights).values(insertInsights)

    // We also update book start and end
    const parsedBookstart = parseDate(insightsResponse.start_date).date
    const parsedBookend = parseDate(insightsResponse.end_date).date
    if (parsedBookstart && parsedBookend) {
      console.log(
        `Updating book start and end. ${parsedBookstart} ${parsedBookend}`
      )
      await db
        .update(books)
        .set({ start_date: parsedBookstart, end_date: parsedBookend })
        .where(eq(books.id, book.id))
    } else {
      console.log("Failed to parse book start and end")
    }
  } else {
    console.log("Insight Assistant Failed")
    throw new Error("Failed to run Insights Assistant")
  }
}
