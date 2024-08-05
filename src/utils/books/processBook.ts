/**
 * Helper utilities for processing new books. Includes:
 * 1. Downloading and saving book image
 */

import { db } from "@/db"
import { SelectBook, books } from "@/db/schema/books"
import { createClient } from "@supabase/supabase-js"
import { configDotenv } from "dotenv"
import { eq } from "drizzle-orm"
import { levenshteinEditDistance } from "levenshtein-edit-distance"
import _ from "lodash"

configDotenv({ path: `.env.${process.env.NODE_ENV ?? "local"}` })
const GOOGLE_BOOKS_URL = (title: string, author: string) =>
  `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}+inauthor:${author}&key=${process.env.GOOGLE_BOOKS_API_KEY}`

const OPEN_LIB_URL = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

const STR_CLOSE_ENOUGH = (a: string, b: string) => {
  levenshteinEditDistance(a, b) <=
    Math.round(Math.abs(a.length - b.length) * 0.15)
}

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

/** Helper function to get an ISBN using Google Books API and - if that doesn't work - then AI */
export async function DetermineISBN(book: SelectBook) {
  // Hepers in case we called for book we already have or can't get ISBN for
  if (book.isbn) return book.isbn
  if (book.isbn13) return book.isbn13
  if (!book.title) return null
  const url = GOOGLE_BOOKS_URL(book.title, book.author ?? "")
  const gBooksResponse = await fetch(url)
  const gBooksData = await gBooksResponse.json()
  let isbn = ""
  console.log("Lookup ISBN", book.title)
  console.log({ url })
  console.log(gBooksData)
  for (const item of gBooksData.items) {
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

export async function ProcessBook(book: SelectBook) {
  if (!book.isbn && !book.isbn13) {
    console.log("Looking for ISBN", book.title)
    book.isbn = await DetermineISBN(book)
    console.log("Resulting ISBN: ", book.isbn)
  }
  // Todo: Also extract events with AI
  let updatedBook = await DownloadBookImage(book)
  return updatedBook
}
