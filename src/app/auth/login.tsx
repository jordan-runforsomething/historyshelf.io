"use client"
import React, { useCallback, useState } from "react"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { HSAuthResponse, login, signup } from "@/utils/supabase/actions"
import { MdEmail, MdPassword } from "react-icons/md"
import { BsPersonRaisedHand } from "react-icons/bs"

type LoginProps = {}

export default function HSLogin(props: LoginProps) {
  const [authResponse, setAuthResponse] = useState<HSAuthResponse>()
  const [mode, setMode] = useState<"login" | "signup">("signup")

  // Our callbacks for login and registration
  const doSignup = useCallback(async (fd: FormData) => {
    const response = await signup(fd)
    setAuthResponse(response)
  }, [])

  const login = useCallback(async (fd: FormData) => {
    const response = await login(fd)
    setAuthResponse(response)
  }, [])

  // Helper to render alert with auth response
  const renderAuthResponse = () => {
    if (!authResponse) return
    return (
      <div className="auth-response p-4 bg-white border border-4">
        <p>{authResponse.message}</p>
      </div>
    )
  }

  return (
    <div>
      <form className="flex flex-col gap-6">
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
        <Input
          color="primary"
          name="displayName"
          type="text"
          label="Display Name"
          placeholder="AryaStark"
          maxLength={15}
          startContent={<BsPersonRaisedHand />}
        />
        <Button color="primary" type="submit" formAction={doSignup}>
          Get Started
        </Button>
        {renderAuthResponse()}
        <hr />
        <div className="flex items-center justify-around">
          <p>Already have an account?</p>
          <Button
            variant="ghost"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Signup" : "Login"}
          </Button>
        </div>
      </form>
    </div>
  )
}
