import { createClient } from "@/utils/supabase/server"
import { Button, Divider } from "@nextui-org/react"
import Link from "next/link"

export default async function WelcomePage() {
  const supabase = await createClient()
  const supabaseUser = await supabase.auth.getUser()
  return (
    <main className="content-container">
      <p className="help mb-4">cue epic music...</p>
      <h1 className="text-4xl mb-4">
        Welcome to Historio, {supabaseUser.data.user?.email}!
      </h1>
      <p className="mb-2">Historio is the app for exploring history.</p>
      <p className="mb-2">
        Historio's most popular feature is Timelines, where you can explore the
        historical overlap between your favorite books and topics. Timelines are
        shareable, and you can comment on them Reddit-style.
      </p>
      <p className="mb-4">
        The easiest way to get started is to import your books from Goodreads
        and add a few to a new Timeline to see it in action. (No personal data
        is imported). Alternatively, you can start by adding books individually
        on in your Library, or exploring popular Timelines that others have
        created.
      </p>
      <hr className="mb-2 mt-2" />
      <div className="actions-container flex justify-end mt-8">
        <Link href="/hs/library" className="mr-4">
          <Button color="default" variant="bordered">
            My Library
          </Button>
        </Link>
        <Link href="/hs/timelines/explore" className="mr-12">
          <Button color="default" variant="bordered">
            Explore Timelines
          </Button>
        </Link>
        <Divider orientation="vertical" />
        <Link href="/library?initialImport=true">
          <Button color="primary" variant="shadow">
            Start Goodreads import
          </Button>
        </Link>
      </div>
    </main>
  )
}
