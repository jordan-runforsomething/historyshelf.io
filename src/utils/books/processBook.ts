/**
 * Helper utilities for processing new books. Includes:
 * 1. Downloading and saving book image
 */

import { db } from "@/db"
import { books, SelectBook } from "@/db/schema/books"
import { insights } from "@/db/schema/insights"
import { configDotenv } from "dotenv"
import { count, eq } from "drizzle-orm"
import { ProcessBookInsights } from "./processBookInsights"
import { DetermineISBN, DownloadBookImage } from "./processBookImage"

configDotenv({ path: `.env.${process.env.NODE_ENV ?? "local"}` })

const MIN_INSIGHTS = 25

export async function ProcessBook(
  book: SelectBook,
  processInsights = true,
  processImage = true
) {
  // First we try and use AI to get book events.
  if (processInsights) {
    const insightCount = await db
      .select({ count: count() })
      .from(insights)
      .where(eq(insights.book_id, book.id))
    console.log(
      `Found ${insightCount[0].count} existing insights for ${book.title}`
    )
    if (insightCount[0].count < MIN_INSIGHTS) {
      await ProcessBookInsights(book)
    }
  }

  if (!book.isbn && !book.isbn13) {
    console.log("Looking for ISBN", book.title)
    try {
      book.isbn = await DetermineISBN(book)
      console.log("Resulting ISBN: ", book.isbn)
    } catch (err) {
      console.log("Failed to determine ISBN")
      console.error(err)
    }
  }
  if (processImage && !book.image_url) {
    await DownloadBookImage(book)
  }

  // Set processed if we updated AI insights, since that's the hard part
  if (processInsights) {
    await db
      .update(books)
      .set({ processed: new Date() })
      .where(eq(books.id, book.id))
  }

  return book
}
