import React from "react"
import { useState } from "react"
import styles from "./login.module.scss"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { login, signup } from "@/utils/supabase/actions"

type LoginProps = {}

export default function HSLogin(props: LoginProps) {
  return (
    <div className={`${styles.HSLogin} bg-white p-4 mt-6`}>
      <form className="flex flex-col gap-6">
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="*****"
        />
        <div className="flex justify-between px-4">
          <Button type="submit" formAction={signup}>
            Signup
          </Button>
          <Button type="submit" formAction={login}>
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}
