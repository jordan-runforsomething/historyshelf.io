import { jsonb, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core"
import { BASE_SCHEMA_FIELDS } from "../base"

export const logTypeEnum = pgEnum("logType", ["ai.insights"])

export const users = pgTable("log", {
  ...BASE_SCHEMA_FIELDS,
  log_type: logTypeEnum("log_type"),
  log_message: varchar("log_message"),
  key: varchar("key"),
  data: jsonb("data"),
})
