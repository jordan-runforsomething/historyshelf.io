"use client"
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
} from "@nextui-org/react"
import Image from "next/image"

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
  const renderRow = (book: SelectBook) => (
    <TableRow key={book.id}>
      <TableCell>
        <Image
          width={50}
          height={50}
          alt={book.title || ""}
          src={book.image_url ? `${BASE_URL}${book.image_url}` : ""}
        ></Image>
      </TableCell>
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
    <Table
      isHeaderSticky
      classNames={{
        base: "max-h-[75vh] overflow-scroll",
        table: "min-h-[420px]",
        wrapper: "py-0",
      }}
    >
      <TableHeader>
        {COLS.map((c) => (
          <TableColumn key={c.uid}>{c.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>{books.map(renderRow)}</TableBody>
    </Table>
  )
}
