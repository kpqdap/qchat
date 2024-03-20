import { AI_NAME } from "@/features/theme/theme-config"

export const dynamic = "force-dynamic"

export const metadata = {
  title: AI_NAME + "Terms of Use",
  description: AI_NAME,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-card/70 flex flex-1 overflow-hidden">{children}</div>
    </>
  )
}
