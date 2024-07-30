/**
 * This script processes all un-processed books including
 * downloading covers, extracting AI events, and backfilling
 * ISBNs
 * (see utils/books/processBook)
 */

import { db } from "@/db"
import { SelectBook, books } from "@/db/schema/books"
import { ProcessBook } from "@/utils/books/processBook"
import { eq, isNotNull, isNull, and } from "drizzle-orm"
import _ from "lodash"

console.log("Script Start: Process All Books")

async function processAllBooks() {
  const booksToUpdate = await db
    .select()
    .from(books)
    .where(and(isNull(books.processed), isNotNull(books.isbn)))
  console.log(`Updating ${booksToUpdate.length} books`)
  const promises = booksToUpdate.map(ProcessBook)
  const updatedBooks: SelectBook[] = _.filter(await Promise.all(promises))
  return updatedBooks
}

processAllBooks()
