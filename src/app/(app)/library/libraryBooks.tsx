import BookTable from "@/components/book/bookTable"
import { getBooksForUser } from "@/db/queries/book"
import { getCurrentUser } from "@/utils/supabase/server"
import { Skeleton } from "@nextui-org/react"
import { Suspense } from "react"

export default async function LibraryBooks() {
  const user = await getCurrentUser()
  const allBooks = await getBooksForUser(user.id)

  return (
    <Suspense fallback={<Skeleton />}>
      <BookTable books={allBooks} />
    </Suspense>
  )
}
