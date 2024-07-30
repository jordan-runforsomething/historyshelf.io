/**
 * Helper utilities for processing new books. Includes:
 * 1. Downloading and saving book image
 */

import { db } from "@/db"
import { SelectBook, books } from "@/db/schema/books"
import { createClient } from "@supabase/supabase-js"
import { eq } from "drizzle-orm"

const OPEN_LIB_URL = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

const BUCKET = "book_covers"
const MIN_BYTES = 100

/**
 * Download a book image and save it in our storage
 * Attempt download from:
 * 1. openlibrary
 * 2. Google Books
 */
export async function DownloadBookImage(book: SelectBook) {
  // First we attempt to download from openlibrary
  const isbn = book.isbn13 || book.isbn
  if (isbn) {
    try {
      const olResponse = await fetch(OPEN_LIB_URL(isbn))
      const blob = await olResponse.blob()
      const buffer = await blob.arrayBuffer()
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_API_KEY!
      )
      if (buffer.byteLength < MIN_BYTES || olResponse.status == 404) {
        console.log(`Image missing from openlib: ${OPEN_LIB_URL(isbn)}`)
        // TODO: Fall back to google books search or something
        throw Error("Missing Image")
      }
      const uploadResponse = await supabase.storage
        .from(BUCKET)
        .upload(`${book.id}.jpg`, buffer, { contentType: "image/jpeg" })

      if (uploadResponse.error) {
        console.log("Error uploading book image")
        throw uploadResponse.error
      }

      await db
        .update(books)
        .set({ image_url: uploadResponse.data.fullPath })
        .where(eq(books.id, book.id))
      book.image_url = uploadResponse.data.fullPath
      console.log(`Saved image for: ${book.title}}`)
      return book
    } catch (err) {
      console.log("Error saving book image")
      console.log(err)
    }
  } else {
    throw new Error(`Invalid ISBN for book: ${book.title} ${book.id}`)
  }
}

export async function ProcessBook(book: SelectBook) {
  // Todo: Also extract events with AI
  let updatedBook = await DownloadBookImage(book)
  return updatedBook
}
