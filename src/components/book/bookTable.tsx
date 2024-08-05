"use client"
import LibraryToolbar from "@/app/(app)/library/libraryToolbar"
/**
 * Component that displays a table of books
 */

import { SelectBook } from "@/db/schema/books"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
} from "@nextui-org/react"
import _ from "lodash"
import Image from "next/image"
import { useMemo, useState } from "react"

export type BookTableProps = {
  books: SelectBook[]
}

const BASE_URL =
  "https://etgrmcgfmeaammbrxfnh.supabase.co/storage/v1/object/public/"

const COLS = [
  { name: "", uid: "cover" },
  { name: "Title", uid: "title" },
  { name: "Author", uid: "author" },
  { name: "Time Period", uid: "time_period" },
  { name: "Insights", uid: "insights" },
  { name: "Notes", uid: "notes" },
  { name: "Timeline", uid: "timeline" },
]

export default function BookTable({ books }: BookTableProps) {
  const [search, setSearch] = useState("")
  const booksLength = books.length
  const sortedBooks = useMemo(() => {
    return _.sortBy(books, (b) => b.goodreads_rating).reverse()
  }, [booksLength])

  const filterBook = (book: SelectBook) => {
    let searchTerm = search.toLowerCase()
    if (book.title?.toLowerCase().includes(searchTerm)) return true
    if (book.author?.toLowerCase().includes(searchTerm)) return true
    return false
  }

  const renderBookImage = (book: SelectBook) => {
    const imageExists = !!book.image_url
    let className = ""
    let src = ""
    if (!imageExists) {
      src = "/img/logo/logo_transparent_bw.png"
      className = "rounded-lg opacity-40 border-2 border-zinc-300"
    } else {
      src = `${BASE_URL}${book.image_url}`
    }
    return (
      <Image
        width={50}
        height={50}
        alt={book.title || ""}
        src={src}
        className={className}
      ></Image>
    )
  }

  const renderRow = (book: SelectBook) => (
    <TableRow key={book.id}>
      <TableCell>{renderBookImage(book)}</TableCell>
      <TableCell>{book.title}</TableCell>
      <TableCell>{book.author}</TableCell>
      <TableCell>
        {book.start_date?.toDateString()} - {book.end_date?.toDateString()}
      </TableCell>
      <TableCell>0</TableCell>
      <TableCell>0</TableCell>
      <TableCell>
        <i>timeline</i>
      </TableCell>
    </TableRow>
  )

  return (
    <section>
      <LibraryToolbar search={search} setSearch={setSearch} />
      <Table
        isHeaderSticky
        classNames={{
          base: "max-h-[75vh] overflow-scroll",
          wrapper: "py-0",
        }}
      >
        <TableHeader>
          {COLS.map((c) => (
            <TableColumn key={c.uid}>{c.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>{sortedBooks.filter(filterBook).map(renderRow)}</TableBody>
      </Table>
    </section>
  )
}
