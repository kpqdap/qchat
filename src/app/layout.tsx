import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/features/ui/toaster"
import { GlobalConfigProvider } from "@/features/global-config/global-client-config-context"
import { Providers } from "@/features/providers"
import { AI_NAME } from "@/features/theme/customise"
import { cn } from "@/lib/utils"
import { Noto_Sans } from "next/font/google"
import "./globals.css"
import { Header } from "./header"
import { NavBar } from "@/features/ui/navbar"

export const dynamic = "force-dynamic"

const notoSans = Noto_Sans({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL("https://qchat.ai.qld.gov.au"),
  title: AI_NAME,
  description: AI_NAME + "the Queensland Government's AI Chatbot",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/pple-icon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="size-full overflow-hidden text-sm" suppressHydrationWarning>
      <body className={cn(notoSans.className, "flex size-full min-w-[400px] flex-col bg-background")}>
        <GlobalConfigProvider>
          <Providers>
            <ThemeProvider>
              <header className="header background xs:h-full flex w-full flex-col sm:h-1/6">
                <Header />
              </header>
              <nav className="nav background flex w-full flex-col">
                <NavBar />
              </nav>
              <main className="main flex flex-col w-full h-full">
                <div className={cn("flex w-full h-full gap-2 bg-primary")}>{children}</div>
              </main>
              <Toaster />
            </ThemeProvider>
          </Providers>
        </GlobalConfigProvider>
      </body>
    </html>
  )
}
