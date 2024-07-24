/**
 * Library - listing books imported/added to the user's library
 */

import React from "react"
import GoodreadsImportModal from "@/components/goodreads/goodreadsImportModal"
import { SearchParamsType } from "@/types"
import { Button } from "@nextui-org/react"
import { MdLibraryAdd } from "react-icons/md"
import { getBooksForUser } from "@/db/queries/book"

export default async function MyLibraryPage({
  searchParams,
}: {
  searchParams: SearchParamsType
}) {
  const initialImport = !!searchParams["initialImport"]
  const allBooks = getBooksForUser()

  return (
    <div>
      <div className="page-title p-6">
        <div className="page-mast flex justify-between">
          <h1>My Library</h1>
          <p>Your library contains all of your Books and Notes.</p>
        </div>
        <div className="page-actions mt-4 flex justify-end">
          <Button className="mr-4">
            <MdLibraryAdd />
            Add Books Individually
          </Button>
          <GoodreadsImportModal initialOpen={initialImport} />
        </div>
      </div>
    </div>
  )
}
