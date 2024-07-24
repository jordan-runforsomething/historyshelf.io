import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Button,
  Link,
  NavbarItem,
  Divider,
} from "@nextui-org/react"
import React, { useCallback } from "react"
import LogoutButton from "../auth/logout"
import styles from "./appLayout.module.scss"

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
    <main className={styles.appLayout}>
      <nav
        className={`${styles.sidebarMenu} flex flex-col w-1/5 max-w-64 bg-black/90 text-white`}
      >
        <div className="brand text-center">
          <h2>HistoryShelf Logo</h2>
        </div>
        <div className="links flex flex-col">
          <Link href="/library">
            <p>My Library</p>
          </Link>
          <Link href="/timelines">
            <p>My Timelines</p>
          </Link>
          <Divider />
          <Link href="/timelines/explore">
            <p>Explore Timelines</p>
          </Link>
          <Divider />
          <Link href="/account">
            <p>Account Settings</p>
          </Link>
        </div>
      </nav>
      <div className="bg-white/50 app-layout-inner">{children}</div>
    </main>
  )
}
