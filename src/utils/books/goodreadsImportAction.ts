"use server"
import { db } from "@/db"
import {
  InsertBook,
  InsertBookForUser,
  SelectBook,
  bookForUser,
  books,
} from "@/db/schema/books"
import { createClient } from "@/utils/supabase/server"
import { parse } from "csv-parse/sync"
import { sql } from "drizzle-orm"
import _ from "lodash"

/**
 * Server action. Takes in
 * @param previousState
 * @param formData
 */

const GOODREADS_NUMBER_FIELDS = [
  "Number of Pages",
  "Year Published",
  "Original Publication Year",
  "My Rating",
  "Average Rating",
  "Book Id",
]

export type GoodreadsImportState = {
  books?: SelectBook[]
  error?: string
  booksImported?: number
  booksCreated?: number
  wasFirstImport?: boolean // Just used for populating getting started tour
}

/**
 * Process file upload with Goodreads import
 * @param previousState
 * @param formData
 * @returns
 */
export default async function goodreadsImportAction(
  previousState: GoodreadsImportState,
  formData: FormData
): Promise<GoodreadsImportState> {
  const supabase = createClient()
  const supabaseAuthResponse = await supabase.auth.getUser()
  if (supabaseAuthResponse.data.user?.role !== "authenticated") {
    return { books: [], error: "Please Login and Try Again" }
  }
  const userID = supabaseAuthResponse.data.user.id
  const file: File | null = formData.get("file") as File
  const onlyRead = !!formData.get("onlyRead")

  // Validate File
  if (!file || file.type !== "text/csv") {
    return {
      ...previousState,
      error: `Invalid file type (${file.type}). Please upload a CSV`,
    }
  }

  try {
    // uploadFile(file, IMPORT_BUCKET, `${randomUUID()}.csv`)
  } catch (err) {
    console.log(err)
    // We forge ahead anyway. Not saving the file isn't really a problem
  }

  // Parse, then We add each book to our database if it doesn't already exist
  // Write temporary file that gets deleted
  const buffer = Buffer.from(await file.arrayBuffer())
  let data = await parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })
  // If we only import read books, filter
  console.log({ onlyRead, formData })
  if (onlyRead) {
    data = data.filter((d) => d["Exclusive Shelf"] === "read")
  }

  // Clean up ISNBs to be numbers
  data = data.map((d) => {
    // Some ISBNs from Amazon are just 0; we need to make them null to satisfy unique constraint
    d["ISBN"] =
      d["ISBN"].length > 4 ? Number(d["ISBN"].replace(/[^0-9]/g, "")) : null
    d["ISBN13"] =
      d["ISBN13"].length > 4 ? Number(d["ISBN13"].replace(/[^0-9]/g, "")) : null
    _.each(GOODREADS_NUMBER_FIELDS, (field) => {
      if (d[field] && _.isNumber(d[field])) d[field] = Number(d[field])
    })
    return d
  })

  const saveValues: InsertBook[] = data.map((d) => {
    return {
      title: d.Title,
      author: d.Author,
      isbn: d.ISBN,
      isbn13: d.ISBN13,
      amazon_id: d["Book Id"],
      goodreads_rating: d["Average Rating"], // Overwritten on upsert
      last_import: new Date(), // Overwritten on upsert
    }
  })

  const result = await db
    .insert(books)
    .values(saveValues)
    .onConflictDoUpdate({
      target: books.amazon_id,
      set: {
        last_import: new Date(),
        goodreads_rating: sql.raw(`excluded.${books.goodreads_rating.name}`),
      },
    })
    .returning()

  const saveBookForUserValues: InsertBookForUser[] = _.map(result, (row) => ({
    supabase_user_id: userID,
    book_id: row.id,
  }))
  const userBooksResult = await db
    .insert(bookForUser)
    .values(saveBookForUserValues)
    .onConflictDoNothing({
      target: [bookForUser.supabase_user_id, bookForUser.book_id],
    })
    .returning({ id: bookForUser.id })

  // For each book, get or create Book object and create UserBook object
  console.log("Goodreads Upload Debug:")
  console.log({
    uploadCount: saveValues.length,
    bookInsertResultCount: result.length,
    bookForUserInsertResultCount: userBooksResult.length,
  })

  // Used to process books immediately. Move to async process instead.
  // If there aren't three processed books, we process three books
  // if (_.filter(result, (r: SelectBook) => r.image_url).length < 3) {
  //   // Process first three books that have an ISBN
  //   const booksToUpdate: SelectBook[] = _.sampleSize(
  //     _.filter(result, (r: SelectBook) => r.isbn),
  //     3
  //   )
  //   const processPromises = booksToUpdate.map((b) =>
  //     ProcessBook(b, false, true)
  //   )
  //   const updatedBooks = await Promise.all(processPromises)
  //   indicesToUpdate.map((i) => (result[i] = updatedBooks[i] || result[i]))
  // }
  return {
    books: _.sortBy(result, "image_url"),
    booksImported: result.length,
    booksCreated: userBooksResult.length,
  }
}
