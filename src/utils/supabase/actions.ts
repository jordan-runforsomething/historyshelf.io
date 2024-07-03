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

export type HSAuthFormState = {
  error?: string
  message?: string
}

export async function login(prevState: HSAuthFormState, formData: FormData) {
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
    return {
      error: error.code,
      email: data.email,
      message:
        SIGNUP_ERROR_MESSAGES[error.code || ""] ?? "Invalid username/password",
    }
  }
  revalidatePath("/", "layout")
  redirect("/hs/onboard")
}

export async function signup(prevState: HSAuthFormState, formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const response = await supabase.auth.signUp(data)

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
      error: response.error.code,
      message,
    }
  } else if (
    response.data.user?.email === data.email &&
    !response.data.user.identities?.length
  ) {
    // Attempting to register as a user who already exists and is confirmed
    // For some reason Supabase does not return this as an error.
    return {
      message: SIGNUP_ERROR_MESSAGES.email_exists,
      error: "email_exists",
      email: data.email,
    }
  }

  revalidatePath("/", "layout")
  return {
    error: "email_not_confirmed",
    email: data.email,
    message:
      "Welcome! Check your email for a confirmation link to get started!",
  }
}
