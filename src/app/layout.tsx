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
    shortcut: "/apple-icon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className="size-full overflow-hidden text-sm">
      <body className={cn(notoSans.className, "flex h-full w-full min-w-[400px] flex-col bg-background")}>
        <GlobalConfigProvider>
          <Providers>
            <ThemeProvider>
              <Header />
              <NavBar />
              {/* <main className="main grid grid-cols-6 w-full h-5/6 bg-background"> */}
              <main className="main bg-background h-5/6 w-full">
                {children}
                {/* <div className={cn("col-span-6 w-full gap-2 bg-primary h-full")}>
                
                </div> */}
              </main>
              <Toaster />
            </ThemeProvider>
          </Providers>
        </GlobalConfigProvider>
      </body>
    </html>
  )
}
