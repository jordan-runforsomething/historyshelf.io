import {
  boolean,
  date,
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { BASE_SCHEMA_FIELDS } from "../base"
import { books } from "./books"
import { users } from "./users"

const COMMON_FIELDS = {
  ...BASE_SCHEMA_FIELDS,
  name: varchar("name"),
  date: date("date"),
  year: numeric("year"),
  is_bc: boolean("is_bc"), // Applies to either date or year (whichever is set)
  description: varchar("description"),
  book_id: uuid("book_id").references(() => books.id),
}

export const insights = pgTable("insights", {
  ...COMMON_FIELDS,
  wikipedia_link: varchar("wikipedia_link"),
  views: numeric("views"),
})

// Notes are owned by a specific user
export const notes = pgTable("notes", {
  ...COMMON_FIELDS,
  user_id: uuid("user_id").references(() => users.id),
  // If note was created from an insight
  insight_id: uuid("insight_id").references(() => insights.id),
})

export type SelectInsight = typeof insights.$inferSelect
export type InsertInsight = typeof insights.$inferInsert
export type SelectNote = typeof notes.$inferSelect
export type InsertNote = typeof notes.$inferInsert
