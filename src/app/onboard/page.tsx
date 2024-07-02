import { createClient } from "@/utils/supabase/server"

export default async function Onboard() {
  // Figure out if the user is logged in
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  const authenticated = !!data?.user

  return (
    <main>
      <h1>Onboard!</h1>
      <p>{error ? JSON.stringify(error) : ""}</p>
      <p>{data.user?.email}</p>
    </main>
  )
}
