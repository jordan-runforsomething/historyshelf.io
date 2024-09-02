/**
 * This script processes all un-processed books including
 * downloading covers, extracting AI events, and backfilling
 * ISBNs
 * (see utils/books/processBook)
 *
 * Use with command: npm run hs:processBooks
 */
import { db } from "@/db"
import { books } from "@/db/schema/books"
import { insights } from "@/db/schema/insights"
import { ProcessBook } from "@/utils/books/processBook"
import { configDotenv } from "dotenv"
import { count, isNull } from "drizzle-orm"
console.log("Script Start: Process All Books")
configDotenv({ path: `.env.${process.env.NODE_ENV}` })

/**
 * Process books by
 * 1. Determien ISBN for those missing ISBN
 * 2. Download image for those we don't have images of
 * 3. Add insights for those we don't have at least minimum insights for
 * @returns
 */
async function processAllBooks(bookCount: number | undefined = undefined) {
  const start = new Date()
  let queryBooksToUpdate = db
    .select()
    .from(books)
    .where(isNull(books.processed))
    .$dynamic()
  if (bookCount) queryBooksToUpdate = queryBooksToUpdate.limit(bookCount)
  const booksToUpdate = await queryBooksToUpdate
  console.log(`Found ${booksToUpdate.length} books to process`)

  // TEMPORARILY making not processing insights so we can better process image
  const promises = booksToUpdate.map((b) => ProcessBook(b, false))
  const result = await Promise.all(promises)
  // const updatedBooks: SelectBook[] = _.filter(await Promise.all(promises))
  // console.log("Missing ISBN:", await missingISBNCount())
  // return updatedBooks
  const insightCount = await db.select({ count: count() }).from(insights)
  const duration = (new Date().getTime() - start.getTime()) / 1000 // Seconds
  console.log(
    `Script End: Process All Books. Duration: ${duration}s. There are now ${insightCount[0].count} insights`
  )
  return true
}

processAllBooks(50)
