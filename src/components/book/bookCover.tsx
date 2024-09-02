import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Skeleton,
  Divider,
} from "@nextui-org/react"
import { SelectBook } from "@/db/schema/books"

const BASE_URL =
  "https://etgrmcgfmeaammbrxfnh.supabase.co/storage/v1/object/public/"

export function BookCover({ book }: { book: SelectBook }) {
  return (
    <Card className="w-1/5 m-4 grow">
      <CardHeader className="">
        <div className="flex w-full flex-col text-center items-center">
          <h3 className="text-center w-full">{book.title}</h3>
          <h5 className="text-gray-500 text-sm w-full">by {book.author}</h5>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex justify-center">
        <Skeleton className="w-full" isLoaded={!!book.image_url}>
          <Image
            className="w-full"
            src={`${BASE_URL}${book.image_url}`}
            alt={book.title || "Book"}
          ></Image>
        </Skeleton>
      </CardBody>
    </Card>
  )
}
