"use client"
import { login, signup } from "@/utils/supabase/actions"
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { useState } from "react"
import { useFormState } from "react-dom"
import { BsPersonRaisedHand } from "react-icons/bs"
import { FaCircleCheck } from "react-icons/fa6"
import { MdEmail, MdPassword } from "react-icons/md"

type LoginProps = {}

export default function HSLogin(props: LoginProps) {
  const [mode, setMode] = useState<"login" | "signup">("signup")
  const [loginState, loginAction] = useFormState(login, {
    message: "",
    error: "",
  })
  const [signupState, signupAction] = useFormState(signup, {
    message: "",
    error: "",
  })

  // Helper to render alert with auth response
  const state = mode === "login" ? loginState : signupState
  const renderAuthResponse = () => {
    if (!state.message) return
    return (
      <div className="auth-response p-4 bg-white border border-4 flex-row justify-center">
        <p>{state.message}</p>
        {state.error === "email_not_confirmed" && (
          <Button variant="ghost" className="mt-2">
            Resend Email
          </Button>
        )}
      </div>
    )
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login")
  }

  const actionCopy = mode === "login" ? "Login" : "Get Started"
  const action = mode === "login" ? loginAction : signupAction

  return (
    <div>
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
            label="Display Name"
            placeholder="AryaStark"
            maxLength={15}
            startContent={<BsPersonRaisedHand />}
          />
        )}
        <Button color="primary" type="submit" formAction={action}>
          {actionCopy}
          <FaCircleCheck />
        </Button>
        {renderAuthResponse()}
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
      </form>
    </div>
  )
}
