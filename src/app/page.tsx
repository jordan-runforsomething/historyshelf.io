import { Button } from "@nextui-org/button"
import HSLogin from "./auth/login"
import styles from "./page.module.scss"
import { createClient } from "@/utils/supabase/client"
// import { createClient } from "@/utils/supabase/server"

export default async function Home() {
  // Figure out if the user is logged in
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const authenticated = !!data?.user

  const loginForm = (
    <>
      <p className="mb-3">Create your free account to get started</p>
      <HSLogin />
    </>
  )
  const alreadyLoggedIn = (
    <>
      <h2 className="text-lg">Welcome Back {data?.user?.email}!</h2>
      <Button href="/hs">Open Dashboard</Button>
    </>
  )

  return (
    <main
      className={`flex min-h-screen flex-row items-center justify-between p-12 ${styles.HSLanding}`}
    >
      <div className="product-description bg-paper p-6 rounded-sm w-2/5">
        <h1>HistoryShelf.io</h1>
        <p>
          Read, Explore, and Share History with fellow geeks and history buffs
        </p>
      </div>

      <div className="login-container bg-paper p-6 text-center rounded-sm w-2/5">
        {authenticated ? alreadyLoggedIn : loginForm}
      </div>
    </main>
  )
}
