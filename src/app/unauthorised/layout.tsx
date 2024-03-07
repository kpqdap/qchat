import { AI_NAME } from "@/features/theme/customise"

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-full w-full items-center justify-center bg-altBackground">{children}</div>
    </>
  )
}
