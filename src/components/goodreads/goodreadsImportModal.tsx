"use client"
import SubmitFormAndStatus from "@/components/forms/formSubmitAndStatus"
import goodreadsImportAction, {
  GoodreadsImportState,
} from "@/utils/books/goodreadsImportAction"
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { FaArrowRight, FaGoodreads } from "react-icons/fa6"

export type GoodreadsImportModalProps = {
  onSuccess?: (result: GoodreadsImportState) => void
  isModalOpen?: boolean
  hideButton?: boolean
}

export default function GoodreadsImportModal({
  onSuccess,
  isModalOpen,
  hideButton,
}: GoodreadsImportModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [uploadState, uploadAction] = useFormState(goodreadsImportAction, {})
  const [fileSelected, setFileSelected] = useState(false)

  // Initialize
  useEffect(() => {
    if (isModalOpen) onOpen()
    else if (isOpen) onClose()
  }, [isModalOpen])
  // useEffect(() => {}, uploadState?.booksImported)

  const renderSuccess = () => {
    if (!uploadState?.booksImported) return
    return (
      <div className="success-message p-4 bg-green-500 rounded flex justify-between items-center">
        <div>
          <h3 className="text-white text-xl">Success!</h3>
          <p className="text-white">
            {uploadState.booksImported} books were imported.{" "}
            {uploadState.booksCreated} books were added to your library.
          </p>
        </div>
        <Link href="/library">
          <Button color="default">
            Open My Library
            <FaArrowRight />
          </Button>
        </Link>
      </div>
    )
  }

  const onlyReadTooltipContent = (
    <div className="text-center">
      <p>
        If checked, only books on your 'read' list in Goodreads will be
        imported.
      </p>
      <p>
        Books on your Goodreads lists that have not been marked
        <br />
        read will not be imported.
      </p>
    </div>
  )

  const renderBody = () => (
    <div className="pb-4">
      <p className="mb-4">
        Importing your books from Goodreads is the fastest way to build your
        Historio library. This process takes about 2 minutes.
      </p>
      <h3>How to export your list of books from Goodreads:</h3>
      <div className="flex">
        <ol className="list-decimal list-inside pr-8">
          <li>
            On the My Books page, click "Import and export" in the menu on the
            left (under Tools)
          </li>
          <li>Click the Export Library button at the top of the page</li>
          <li>
            A CSV file will be created and a link will appear to download it
            (this may take a couple of minutes)
          </li>
          <li>
            Download the file, and click "Choose File" below to upload it to
            Historio.
          </li>
        </ol>
      </div>
      <form action={uploadAction}>
        <div className="flex border-4 border-gray-300 rounded-lg p-4 justify-around mt-4 items-center">
          <div>
            <p className="help mb-2">Choose a File, then click Submit</p>
            <input
              onChange={() => setFileSelected(true)}
              name="file"
              type="file"
              className="mr-6"
            />
          </div>
          <div>
            <Tooltip content={onlyReadTooltipContent}>
              <Checkbox value="1" defaultSelected name="onlyRead">
                Only Import Read Books
              </Checkbox>
            </Tooltip>
          </div>
          <SubmitFormAndStatus
            isDisabled={!fileSelected}
            error={uploadState.error}
          />
        </div>
      </form>
    </div>
  )

  return (
    <>
      {!hideButton && (
        <Button color="primary" onClick={onOpen}>
          <FaGoodreads />
          Add Books from Goodreads
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalContent>
          <ModalHeader>Goodreads Import</ModalHeader>
          <ModalBody className="flex">
            {uploadState?.booksImported ? renderSuccess() : renderBody()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
