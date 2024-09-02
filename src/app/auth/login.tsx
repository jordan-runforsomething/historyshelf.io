"use client"
import { login, signup } from "@/utils/supabase/actions"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { useState } from "react"
import { useFormState } from "react-dom"
import { BsPersonRaisedHand } from "react-icons/bs"
import { FaCircleCheck } from "react-icons/fa6"
import { MdEmail, MdPassword } from "react-icons/md"
import { createClient } from "@/utils/supabase/client"

export default function HSLogin() {
  const [mode, setMode] = useState<"login" | "signup">("signup")
  const [loginState, loginAction] = useFormState(login, {
    message: "",
    error: "",
    email: "",
  })
  const [signupState, signupAction] = useFormState(signup, {
    message: "",
    error: "",
    email: "",
  })
  const [resendingSignup, setResendingSignup] = useState(false)
  const [resentEmail, setResentEmail] = useState(false)
  const client = createClient()
  const state = mode === "login" ? loginState : signupState

  // Resend signup email.
  const resendSignup = async () => {
    if (!state.email || resentEmail) return
    setResendingSignup(true)
    try {
      await client.auth.resend({
        type: "signup",
        email: state.email,
      })
    } finally {
      setResendingSignup(false)
      setResentEmail(true)
    }
  }

  // Helper to render alert with auth response
  const renderAuthResponse = () => {
    if (!state.message) return
    return (
      <div className="auth-response p-4 bg-white border border-4 flex-row justify-center">
        <p>{state.message}</p>
        {state.error === "email_not_confirmed" && state.email && (
          <Button
            onClick={resendSignup}
            isLoading={resendingSignup}
            variant="ghost"
            className="mt-2"
            isDisabled={resentEmail}
          >
            {resentEmail ? "Email Re-Sent" : "Resend Email"}
          </Button>
        )}
      </div>
    )
  }

  // Switch between login and signup form
  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login")
  }

  const actionCopy = mode === "login" ? "Login" : "Get Started"
  const action = mode === "login" ? loginAction : signupAction
  const shouldRenderLogin = !(
    state.error === "email_not_confirmed" && state.email
  )

  const renderForm = () => {
    if (!shouldRenderLogin) return
    return (
      <form className="flex flex-col gap-6" action={action}>
        <div className="flex gap-2">
          <Input
            color="primary"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            startContent={<MdEmail />}
          />
          <Input
            color="primary"
            name="password"
            type="password"
            label="Password"
            placeholder="*****"
            startContent={<MdPassword />}
          />
        </div>
        {mode === "signup" && (
          <Input
            color="primary"
            name="displayName"
            type="text"
            label="Display Name (How others will see you on HistoryShelf)"
            maxLength={15}
            startContent={<BsPersonRaisedHand />}
          />
        )}
        <Button color="primary" type="submit" formAction={action}>
          {actionCopy}
          <FaCircleCheck />
        </Button>
      </form>
    )
  }

  return (
    <div>
      {renderForm()}
      {renderAuthResponse()}
      {shouldRenderLogin && (
        <>
          <hr />
          <div className="flex items-center justify-around">
            {mode === "signup" && <p>Already have an account?</p>}
            {mode === "login" && <p>New to HistoryShelf?</p>}
            <Button
              variant="ghost"
              isDisabled={state.error === "email_not_confirmed"}
              onClick={toggleMode}
            >
              {mode === "login" ? "Create an Account" : "Login"}
            </Button>
          </div>
          <hr />
        </>
      )}
    </div>
  )
}
