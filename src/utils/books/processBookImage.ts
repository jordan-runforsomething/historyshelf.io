import { db } from "@/db"
import { books, SelectBook } from "@/db/schema/books"
import { createClient } from "@supabase/supabase-js"
import { eq } from "drizzle-orm"
import _ from "lodash"

const GOOGLE_BOOKS_URL = (title: string, author: string) =>
  `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}+inauthor:${author}&key=${process.env.GOOGLE_BOOKS_API_KEY}`

const BUCKET = "book_covers"
const MIN_BYTES = 100
const OPEN_LIB_URL = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

/** Helper function to get an ISBN using Google Books API
 * ISBN necessary to download image from openlib
 */
export async function DetermineISBN(book: SelectBook) {
  // Hepers in case we called for book we already have or can't get ISBN for
  if (book.isbn) return book.isbn
  if (book.isbn13) return book.isbn13
  if (!book.title) return null
  const url = GOOGLE_BOOKS_URL(book.title, book.author ?? "")
  const gBooksResponse = await fetch(url)
  const gBooksData = await gBooksResponse.json()
  let isbn = ""
  for (const parentItem of gBooksData.items) {
    const item = parentItem.volumeInfo
    // Sometimes titles are slightly different. We first check if title and author match exactly.
    const longTitle = `${item.title} ${item.subtitle}`
    if ([longTitle, item.title].includes(book.title)) {
      isbn = _.find(item.industryIdentifiers, (i) =>
        ["ISBN_13", "ISBN_10"].includes(i.type)
      )?.identifier
    }
    if (isbn) break
  }
  return isbn
}

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
    throw new Error(
      `Invalid ISBN for book: ${book.title} ${book.isbn} ${book.isbn13}`
    )
  }
}
