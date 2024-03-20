import type { Metadata } from "next"
import { Toaster } from "@/features/ui/toaster"
import { cn } from "@/lib/utils"
import { Noto_Sans } from "next/font/google"
import "./globals.css"
import { Header } from "./header"
import { NavBar } from "@/features/ui/navbar"
import { ThemeProvider } from "@/features/theme/theme-provider"
import { AI_NAME } from "@/features/theme/theme-config"
import { GlobalConfigProvider } from "@/features/globals/global-client-config-context"
import { Providers } from "@/features/globals/providers"

const notoSans = Noto_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://qchat.ai.qld.gov.au"),
  title: AI_NAME,
  description: AI_NAME + "the Queensland Government's AI Chatbot",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/apple-icon.png",
    apple: "/apple-icon.png",
  },
}

export const dynamic = "force-dynamic"

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className="size-full overflow-hidden text-sm">
      <body className={cn(notoSans.className, "flex h-full w-full min-w-[400px] flex-col bg-background")}>
        <GlobalConfigProvider>
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Header />
              <NavBar />
              <main className="main h-5/6 w-full bg-background">{children}</main>
              <Toaster />
            </ThemeProvider>
          </Providers>
        </GlobalConfigProvider>
      </body>
    </html>
  )
}
