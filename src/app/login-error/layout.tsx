import { AI_NAME } from "@/features/theme/theme-config"

export const metadata = {
  title: AI_NAME + " Login Error",
  description: AI_NAME + " - Login Error",
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <div className="flex size-full items-center justify-center bg-altBackground">{children}</div>
    </>
  )
}
