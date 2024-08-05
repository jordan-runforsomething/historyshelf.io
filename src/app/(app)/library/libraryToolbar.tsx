"use client"
import React, { useEffect, useMemo } from "react"
import _ from "lodash"
import { Button, Divider, Input } from "@nextui-org/react"
import GoodreadsImportModal from "@/components/goodreads/goodreadsImportModal"
import { MdLibraryAdd } from "react-icons/md"
import { useSearchParams } from "next/navigation"

export type LibraryToolbarProps = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default function LibraryToolbar({
  search,
  setSearch,
}: LibraryToolbarProps) {
  const searchParams = useSearchParams()
  const initialImport = !!searchParams.get("initialImport")

  const handleChange = (e) => {
    setSearch(e.target.value)
  }
  const debouncedResults = useMemo(() => {
    return _.debounce(handleChange, 100)
  }, [])

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  return (
    <div className="flex justify-end p-2 m-2">
      <Button className="mb-2 tour-goodreads-import mr-4">
        <MdLibraryAdd />
        Add Books Individually
      </Button>
      <div className="mr-4">
        <GoodreadsImportModal isModalOpen={initialImport} />
      </div>
      <Divider orientation="vertical" />
      <Input
        className="w-96"
        placeholder="Search..."
        value={search}
        onChange={handleChange}
      />
    </div>
  )
}
