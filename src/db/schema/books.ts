import {
  boolean,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { BASE_SCHEMA_FIELDS } from "../base"
import { users } from "./users"

export const books = pgTable("books", {
  ...BASE_SCHEMA_FIELDS,
  title: varchar("title"),
  author: varchar("author"),
  isbn: varchar("isbn").unique(),
  isbn13: varchar("isbn13").unique(),
  amazon_id: varchar("amazon_id").unique(),
  description: varchar("description"),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  goodreads_rating: numeric("goodreads_rating"),
  last_import: timestamp("last_import"), // Last datetime at which someone added this book
  image_url: varchar("image_url"),
  // When we ran processing to extract events and download image
  // null if this hasn't happened yet
  processed: timestamp("processed"),

  // Last time we attempted to get insights and failed to find new ones
  insights_done: timestamp("insights_done"),
  small_insights_done: timestamp("small_insights_done"),
})
export type InsertBook = typeof books.$inferInsert
export type SelectBook = typeof books.$inferSelect

// Pass through to relate books with users, track favorites
export const bookForUser = pgTable(
  "book_for_user",
  {
    ...BASE_SCHEMA_FIELDS,
    supabase_user_id: uuid("supabase_user_id"),
    user_id: uuid("user_id").references(() => users.id), // Supabase User ID
    book_id: uuid("book_id").references(() => books.id),
    favorite: boolean("favorite").default(false),
  },
  (table) => {
    return {
      id: uniqueIndex("unique_user_book").on(
        table.supabase_user_id,
        table.book_id
      ),
    }
  }
)
export type InsertBookForUser = typeof bookForUser.$inferInsert
export type SelectBookForUser = typeof bookForUser.$inferSelect
