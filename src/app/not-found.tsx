import Typography from "@/components/typography"
import { Card } from "@/features/ui/card"
import { userSession } from "@/features/auth/helpers"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Home() {
  const user = await userSession()
  if (user) {
    redirect("/chat")
  }
  return (
    <Card className="h-full flex-1 overflow-hidden relative items-center justify-center flex gap-2 flex-col min-w-[300px]">
      <Typography variant="h1">Uh-Oh</Typography>
      <Typography variant="p">We couldn&apos;t find that page</Typography>
      <br />
      <Link href="/">
        <span className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out">
          Return Home
        </span>
      </Link>
    </Card>
  )
}
