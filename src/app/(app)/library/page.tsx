/**
 * Library - listing books imported/added to the user's library
 */

import BookTable from "@/components/book/bookTable"
import GoodreadsImportModal from "@/components/goodreads/goodreadsImportModal"
import { getBooksForUser } from "@/db/queries/book"
import { SearchParamsType } from "@/types"
import { getCurrentUser } from "@/utils/supabase/server"
import { Button, Chip } from "@nextui-org/react"
import { MdLibraryAdd } from "react-icons/md"
import styles from "./library.module.scss"
import LibraryTour from "./libraryTour"

export default async function MyLibraryPage({
  searchParams,
}: {
  searchParams: SearchParamsType
}) {
  const initialImport = !!searchParams["initialImport"]
  const showTour = !!searchParams["tour"]
  const user = await getCurrentUser()
  const allBooks = await getBooksForUser(user.id)

  return (
    <div className="page">
      {showTour && <LibraryTour />}
      <div className="page-mast py-4 flex justify-center items-center">
        <h1 className="mr-6 tour-title">Library</h1>
        <div className="ml-6">
          <p>Your library contains all of your Books and Notes.</p>
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
            className="m4-r tour-insights"
            variant="flat"
          >
            14,320 Insights
          </Chip>
          <Chip color="primary" className="tour-notes" size="sm" variant="flat">
            0 Notes
          </Chip>
        </div>
        <div className="page-actions flex flex-col items-end">
          <Button className="mb-2 tour-goodreads-import">
            <MdLibraryAdd />
            Add Books Individually
          </Button>
          <GoodreadsImportModal isModalOpen={initialImport} />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <BookTable books={allBooks} />
      </div>
    </div>
  )
}
