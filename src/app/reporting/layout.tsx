import { AI_NAME } from "@/features/theme/customise"

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
}

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  return (
    <>
      <div className="h-full w-full flex-1">{children}</div>
    </>
  )
}
