import { numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { BASE_SCHEMA_FIELDS } from "../base"

export const users = pgTable("users", {
  ...BASE_SCHEMA_FIELDS,
  display_name: varchar("display_name"),
  location: varchar("location"),
  avatar_url: varchar("avatar_url"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  supabase_id: uuid("supabase_id"),
})
export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
