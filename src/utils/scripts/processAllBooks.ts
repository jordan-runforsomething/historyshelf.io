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
import { ProcessBook } from "@/utils/books/processBook"
import { configDotenv } from "dotenv"
import { and, count, isNull } from "drizzle-orm"
console.log("Script Start: Process All Books")
configDotenv({ path: `.env.${process.env.NODE_ENV}` })

const missingISBNCount = async () => {
  const result = await db
    .select({ count: count() })
    .from(books)
    .where(and(isNull(books.isbn), isNull(books.isbn13)))
  return result[0].count
}

/**
 * Process books by
 * 1. Determien ISBN for those missing ISBN
 * 2. Download image for those we don't have images of
 * 3. Add insights for those we don't have at least minimum insights for
 * @returns
 */
async function processAllBooks(count: number | undefined = undefined) {
  let queryBooksToUpdate = db
    .select()
    .from(books)
    .where(isNull(books.processed))
    .$dynamic()
  if (count) queryBooksToUpdate = queryBooksToUpdate.limit(count)
  const booksToUpdate = await queryBooksToUpdate

  console.log(`Found ${booksToUpdate.length} books to process`)

  const promises = booksToUpdate.map((b) => ProcessBook(b))
  const result = await Promise.all(promises)
  // const updatedBooks: SelectBook[] = _.filter(await Promise.all(promises))
  // console.log("Missing ISBN:", await missingISBNCount())
  // return updatedBooks
  console.log("Script End: Process All Books")
  return true
}

processAllBooks(10)
