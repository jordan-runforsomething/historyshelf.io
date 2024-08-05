/**
 * This script processes all un-processed books including
 * downloading covers, extracting AI events, and backfilling
 * ISBNs
 * (see utils/books/processBook)
 *
 * Use with command: npm run hs:processBooks
 */
import { db } from "@/db"
import { SelectBook, books } from "@/db/schema/books"
import { ProcessBook } from "@/utils/books/processBook"
import { configDotenv } from "dotenv"
import { eq, isNotNull, isNull, and, count, or } from "drizzle-orm"
import _ from "lodash"
console.log("Script Start: Process All Books")
configDotenv({ path: `.env.${process.env.NODE_ENV}` })

const missingISBNCount = async () => {
  const result = await db
    .select({ count: count() })
    .from(books)
    .where(and(isNull(books.isbn), isNull(books.isbn13)))
  return result[0].count
}

async function processAllBooks() {
  console.log("Missing ISBN:", await missingISBNCount())
  const booksToUpdate = await db
    .select()
    .from(books)
    .where(eq(books.id, "3aa5e332-d648-4b38-9768-b4d4601ffe1b"))
  console.log(`Updating ${booksToUpdate.length} books`)
  const promises = booksToUpdate.map(ProcessBook)
  const updatedBooks: SelectBook[] = _.filter(await Promise.all(promises))
  console.log("Missing ISBN:", await missingISBNCount())
  return updatedBooks
}

processAllBooks()
