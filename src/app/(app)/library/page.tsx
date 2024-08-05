/**
 * Library - listing books imported/added to the user's library
 */

import BookTable from "@/components/book/bookTable"
import { getBooksForUser } from "@/db/queries/book"
import { SearchParamsType } from "@/types"
import { getCurrentUser } from "@/utils/supabase/server"
import { Chip, Divider } from "@nextui-org/react"
import styles from "./library.module.scss"
import LibraryTour from "./libraryTour"

export default async function MyLibraryPage({
  searchParams,
}: {
  searchParams: SearchParamsType
}) {
  const showTour = !!searchParams["tour"]
  const user = await getCurrentUser()
  const allBooks = await getBooksForUser(user.id)

  return (
    <div className="page">
      {showTour && <LibraryTour />}
      <div className="page-mast py-4 flex justify-center items-center">
        <h1 className="mr-6 tour-title handwriting">Library</h1>
        <div className="ml-6">
          <p className="mb-1">
            Your library contains all of your Books and Notes.
          </p>
          <Chip
            color="primary"
            className="mr-4 tour-books"
            size="sm"
            variant="flat"
          >
            {allBooks.length} books
          </Chip>

          <Chip
            color="primary"
            size="sm"
            className="mr-4 tour-insights"
            variant="flat"
          >
            14,320 Insights
          </Chip>
          <Chip color="primary" className="tour-notes" size="sm" variant="flat">
            0 Notes
          </Chip>
        </div>
      </div>
      <div className="m-auto w-3/4 mb-2">
        <Divider />
      </div>

      <div className={styles.tableContainer}>
        <BookTable books={allBooks} />
      </div>
    </div>
  )
}
