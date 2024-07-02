"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "./server"

// Convert Supabase Error messages into user-readable messages
// https://supabase.com/docs/reference/javascript/auth-error-codes
const SIGNUP_ERROR_MESSAGES = {
  email_exists:
    "An account already exists with this email address. If this is your email, please login instead.",
  email_not_confirmed:
    "This email address is pending confirmation. Please click the link in the email we just sent you to get started",
}

export type HSAuthResponse = {
  success: boolean
  error?: string
  message: string
}

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const response = await supabase.auth.signUp(data)
  console.log(response)
  console.log(JSON.stringify(response))

  if (response.error) {
    console.log({ data })
    console.log(response.error)
    let message = "An unexpected error occured, please try again"
    if (response.error.message in SIGNUP_ERROR_MESSAGES) {
      message = SIGNUP_ERROR_MESSAGES[response.error.message]
    } else {
      // TODO: Log error with Sentry; could be backend thing
    }
    return {
      success: false,
      error: response.error.code,
      message,
    }
  }
  console.log("Success")
  return {
    success: true,
    message:
      "Welcome! Check your email for a confirmation link to get started!",
  }
}
