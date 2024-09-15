import { db } from "@/db"
import { bookForUser, books, FrontendBook } from "../schema/books"
import { count, eq } from "drizzle-orm"
import _ from "lodash"
import { insights, notes } from "../schema/insights"
import { getCurrentUser } from "@/utils/supabase/server"

export async function getBooksForUser(
  userID?: string
): Promise<FrontendBook[]> {
  if (!userID) {
    const user = await getCurrentUser()
    userID = user.id
  }

  const result = await db
    .select({
      book: books,
      noteCount: count(notes.id),
      insightCount: count(insights.id),
    })
    .from(books)
    .innerJoin(bookForUser, eq(books.id, bookForUser.book_id))
    .leftJoin(notes, eq(notes.book_id, books.id))
    .leftJoin(insights, eq(insights.book_id, books.id))
    .where(eq(bookForUser.supabase_user_id, userID))
    .groupBy(books.id)

  return _.map(result, (r) => ({
    ...r.book,
    note_count: r.noteCount,
    insight_count: r.insightCount,
  }))
}
