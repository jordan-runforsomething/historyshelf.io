import { db } from "@/db"
import { bookForUser, books } from "../schema/books"
import { eq } from "drizzle-orm"

export async function getBooksForUser(userID: string) {
  const result = await db
    .select({ book: books })
    .from(books)
    .innerJoin(bookForUser, eq(books.id, bookForUser.book_id))
    .where(eq(bookForUser.supabase_user_id, userID))

  return result
}
