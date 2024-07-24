"use client"
import SubmitFormAndStatus from "@/components/forms/formSubmitAndStatus"
import goodreadsImportAction, {
  GoodreadsImportState,
} from "@/utils/books/goodreadsImportAction"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import { useEffect } from "react"
import { useFormState } from "react-dom"
import { FaGoodreads } from "react-icons/fa6"

export type GoodreadsImportModalProps = {
  onSuccess?: (result: GoodreadsImportState) => void
  initialOpen?: boolean
}

export default function GoodreadsImportModal({
  onSuccess,
  initialOpen,
}: GoodreadsImportModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [uploadState, uploadAction] = useFormState(goodreadsImportAction, {})

  // Initialize
  useEffect(() => {
    if (initialOpen) onOpen()
  }, [])
  // useEffect(() => {}, uploadState?.booksImported)

  const renderSuccess = () => {
    if (!uploadState?.booksImported) return
    return (
      <div className="success-message p-4">
        <p>Success!</p>
        <p>
          {uploadState.booksImported} books were imported.{" "}
          {uploadState.booksCreated} books were added to your library.
        </p>
      </div>
    )
  }

  return (
    <>
      <Button color="primary" onClick={onOpen}>
        <FaGoodreads />
        Add Books from Goodreads
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalContent>
          <ModalHeader>Goodreads Import</ModalHeader>
          <ModalBody className="flex">
            <div>
              <h3>How to export your list of books from Goodreads:</h3>
              <div className="flex">
                <ol className="list-decimal list-inside pr-8">
                  <li>
                    On the My Books page, click "Import and export" in the menu
                    on the left (under Tools)
                  </li>
                  <li>
                    Click the Export Library button at the top of the page
                  </li>
                  <li>
                    A CSV file will be created and a link will appear to
                    download it (this may take a couple of minutes)
                  </li>
                  <li>
                    Download the file, and click "Choose File" below to upload
                    it to Historio.
                  </li>
                </ol>
              </div>
              <div className="pl-8">
                <form action={uploadAction}>
                  <div className="flex border-4 border-gray-300 rounded-lg p-4 justify-around mt-4 items-center">
                    <div>
                      <p className="help mb-2">
                        Choose a File, then click Submit
                      </p>
                      <input name="file" type="file" className="mr-6" />
                    </div>
                    <SubmitFormAndStatus error={uploadState.error} />
                  </div>
                  {renderSuccess()}
                </form>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
