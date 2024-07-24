/**
 * Helper utilities for processing new books. Includes:
 * 1. Downloading and saving book image
 */

import { SelectBook, books } from "@/db/schema/books"
import { uploadFile } from "../supabase/actions"
import { db } from "@/db"
import { eq } from "drizzle-orm"

const OPEN_LIB_URL = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`

/**
 * Download a book image and save it in our storage
 * Attempt download from:
 * 1. openlibrary
 * 2. Google Books
 */
export async function DownloadBookImage(book: SelectBook) {
  // First we attempt to download from openlibrary
  const isbn = book.isbn || book.isbn13
  if (isbn) {
    try {
      const olResponse = await fetch(OPEN_LIB_URL(isbn))
      const fileData = new File([await olResponse.blob()], `${book.id}.jpg`)
      const uploadResponse = await uploadFile(
        fileData,
        "book_covers",
        `${book.id}.jpg`
      )
      await db
        .update(books)
        .set({ image_url: uploadResponse.fullPath })
        .where(eq(books.id, book.id))
      book.image_url = uploadResponse.fullPath
      return book
    } catch (err) {
      console.log("Error downloading book image")
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
