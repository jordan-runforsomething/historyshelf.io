import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Link,
  NavbarItem,
} from "@nextui-org/react"
import React, { useCallback } from "react"
import LogoutButton from "../auth/logout"

export default function HSAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Log the user out; redirect to home page
  const doLogout = useCallback(async () => {
    // const client = createClient()
    // await client.auth.signOut()
    // router.push("/")
  }, [])

  return (
    <main>
      <Navbar isBordered className="">
        <NavbarBrand>HistoryShelf</NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <LogoutButton />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {children}
    </main>
  )
}
