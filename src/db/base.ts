import { timestamp, uuid } from "drizzle-orm/pg-core"

export const BASE_SCHEMA_FIELDS = {
  created: timestamp("created").defaultNow(),
  id: uuid("id").primaryKey().defaultRandom(),
}
