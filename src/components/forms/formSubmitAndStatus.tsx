"use clent"
import { Button } from "@nextui-org/react"
import { useFormStatus } from "react-dom"

/**
 * Component that just renders a submit button and
 * optional error message. We make this little component so that we can use
 * useFormStatus, and so that the UI is consistent
 */
export type SubmitFormAndStatusProps = {
  submitText?: string
  action?: (payload: FormData) => void
  error?: string
  isDisabled?: boolean
}
export default function SubmitFormAndStatus({
  submitText = "Submit",
  error,
  isDisabled,
}: SubmitFormAndStatusProps) {
  const { pending, data, method } = useFormStatus()

  const renderError = () => {
    if (!error) return
    return <div className="form-error">{error}</div>
  }

  return (
    <div>
      <Button
        color="primary"
        type="submit"
        isLoading={pending}
        isDisabled={pending || isDisabled}
      >
        {submitText}
      </Button>
      {renderError()}
    </div>
  )
}
