import { Divider, Link, Image } from "@nextui-org/react"
import React, { useCallback } from "react"
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
        <h2 className="text-center text-4xl handwriting mb-8 mt-4">Historio</h2>
        <div className="links flex flex-col align-end text-right">
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
        <div className="pt-4 flex justify-center">
          <div className="w-1/2">
            <Image
              src="/img/logo/logo_transparent.png"
              className="w-full"
              alt="Historio"
            />
          </div>
        </div>
      </nav>
      <div className="bg-white/50 app-layout-inner">{children}</div>
    </main>
  )
}
