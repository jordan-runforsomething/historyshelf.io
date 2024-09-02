"use client"
import { Button } from "@nextui-org/react"
import { createClient } from "@/utils/supabase/client"

export default function LogoutButton() {
  const doLogout = async () => {
    const client = createClient()
    await client.auth.signOut()
    window.location.href = "/"
  }

  return (
    <Button variant="ghost" onClick={doLogout}>
      Logout
    </Button>
  )
}
