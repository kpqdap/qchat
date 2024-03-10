import { AI_NAME } from "@/features/theme/theme-config"

export const dynamic = "force-dynamic"

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
}

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  return (
    <>
      <div className="flex flex-1 overflow-hidden bg-card/70">{children}</div>
    </>
  )
}
