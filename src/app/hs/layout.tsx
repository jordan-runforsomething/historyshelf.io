import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Link,
  NavbarItem,
} from "@nextui-org/react"
import React, { useCallback } from "react"
// import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/router"

export default function HSAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  // Log the user out; redirect to home page
  const doLogout = useCallback(async () => {
    // const client = createClient()
    // await client.auth.signOut()
    router.push("/")
  }, [])

  return (
    <main>
      <Navbar isBordered className="">
        <NavbarBrand>HistoryShelf</NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link onClick={doLogout}>Logout</Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {children}
    </main>
  )
}
