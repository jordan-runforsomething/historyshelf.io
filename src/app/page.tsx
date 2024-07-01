import HSLogin from "./login/login"
import { createClient } from "@/utils/supabase/server"

export default async function Home() {
  // Figure out if the user is logged in
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const authenticated = !!data?.user

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1>HistoryShelf.io</h1>
      <p>Get started by signing in or creating an account:</p>
      <p>Authenticated: {authenticated ? "true" : "false"}</p>
      <p>{data?.user?.id}</p>
      <HSLogin />
    </main>
  )
}
