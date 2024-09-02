// Helper script that runs our AI to extract insights
// npx tsx src/utils/books/testProcessBookInsights.ts

import { db } from "@/db"
import { books } from "@/db/schema/books"
import { like } from "drizzle-orm"
import { z } from "zod"
import { ProcessBookInsights } from "./processBookInsights"

async function test() {
  const book = await db
    .select()
    .from(books)
    .where(like(books.title, "%Guns of August%"))
  ProcessBookInsights(book[Math.floor(Math.random() * book.length)])
}

test()

// These schemas are also specified in OpenAI assistant
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
  nonfiction_history_book: z
    .boolean()
    .describe(
      "True if and only if the book is primarily a history book, and not a work of fiction"
    ),
})
const t = bookInsightsSchema._type
const testVar: typeof t = {}
// const jsonSchema = zodToJsonSchema(bookInsightsSchema, "book_insights")
// console.dir(jsonSchema, { depth: null })
// console.log(JSON.stringify(jsonSchema, null, 2))
