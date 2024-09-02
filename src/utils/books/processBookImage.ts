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
  if (book.isbn || book.isbn13 || !book.title) return book
  const url = GOOGLE_BOOKS_URL(book.title, book.author ?? "")
  const gBooksResponse = await fetch(url)
  const gBooksData = await gBooksResponse.json()
  let isbn = ""
  console.debug(`Determine ISBN for ${book.title} by ${book.author}`)
  console.debug(gBooksData.items[0].volumeInfo)
  for (const parentItem of gBooksData.items) {
    const item = parentItem.volumeInfo
    const isbn = _.find(item.industryIdentifiers, (i) =>
      ["ISBN_13", "ISBN_10"].includes(i.type)
    )?.identifier
    if (!isbn) continue

    const longTitle = `${item.title} ${item.subtitle}`
    const titleMatch = [longTitle, item.title].includes(book.title)
    const authorMatch =
      book.title.toLowerCase().includes(item.title.toLowerCase()) &&
      book.author?.toLowerCase() === item.authors[0].toLowerCase()
    if (titleMatch || authorMatch) {
      book.isbn = isbn
      // Return ISBN, and update image while we are at it!
      if (!item.image_url && item.imageLinks?.thumbnail) {
        book = await DownloadBookImage(book, item.imageLinks.thumbnail)
      }
      return book
    }
  }
  return book
}

/**
 * Download a book image and save it in our storage
 * Attempt download from:
 * 1. openlibrary
 * 2. Google Books
 */
export async function DownloadBookImage(
  book: SelectBook,
  forceURL: string | undefined = undefined
) {
  // First we attempt to download from openlibrary
  const isbn = book.isbn13 || book.isbn
  if (isbn) {
    try {
      const url = forceURL ? forceURL : OPEN_LIB_URL(isbn)
      const olResponse = await fetch(url)
      const blob = await olResponse.blob()
      const buffer = await blob.arrayBuffer()
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_API_KEY!
      )
      if (buffer.byteLength < MIN_BYTES || olResponse.status == 404) {
        console.log(`Image missing from openlib: ${OPEN_LIB_URL(isbn)}`)
        throw Error("Missing Image -- Download Failed or File Doesn't Exist")
      }
      let uploadResponse = await supabase.storage
        .from(BUCKET)
        .upload(`${book.id}.jpg`, buffer, { contentType: "image/jpeg" })

      // Upsert if already exists
      if (uploadResponse.error?.message === "The resource already exists") {
        uploadResponse = await supabase.storage
          .from(BUCKET)
          .update(`${book.id}.jpg`, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          })
      }
      if (uploadResponse.error) {
        throw uploadResponse.error
      }

      await db
        .update(books)
        .set({ image_url: uploadResponse.data.fullPath })
        .where(eq(books.id, book.id))
      book.image_url = uploadResponse.data.fullPath
      console.log(`Saved image for: ${book.title}`)
      return book
    } catch (err) {
      console.log("Error saving book image")
      console.log(err)
      return book
    }
  } else {
    throw new Error(
      `Invalid ISBN for book: ${book.title} ${book.isbn} ${book.isbn13}`
    )
  }
}
