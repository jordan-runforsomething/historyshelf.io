import { getBooksForUser } from "@/db/queries/book"
import { Chip } from "@nextui-org/react"
import _ from "lodash"
import { MdStickyNote2 } from "react-icons/md"
import { PiMagicWand } from "react-icons/pi"

export default async function LibraryChips() {
  const booksForUser = await getBooksForUser()

  return (
    <div>
      <Chip
        color="primary"
        className="mr-4 tour-books"
        size="sm"
        variant="flat"
      >
        {booksForUser.length} books
      </Chip>

      <Chip
        color="primary"
        size="sm"
        className="mr-4 tour-insights"
        variant="flat"
        startContent={<PiMagicWand />}
      >
        {_.sumBy(booksForUser, "insight_count")} Insights
      </Chip>
      <Chip
        color="primary"
        className="tour-notes"
        size="sm"
        variant="flat"
        startContent={<MdStickyNote2 />}
      >
        {_.sumBy(booksForUser, "note_count")} Notes
      </Chip>
    </div>
  )
}
