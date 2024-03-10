import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalConfigProvider } from "@/features/global-config/global-client-config-context"
import { Providers } from "@/features/providers"
import { AI_NAME } from "@/features/theme/customise"
import { Noto_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css"
import { Header } from "./header"
import { Footer } from "./footer"
import { NavBar } from "@/components/ui/navbar"

export const dynamic = "force-dynamic"

const notoSans = Noto_Sans({ subsets: ["latin"] })

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-auto text-sm">
      <body className={cn(notoSans.className, "h-full w-full flex flex-col min-w-[400px] bg-background")}>
        <GlobalConfigProvider>
          <Providers>
            <ThemeProvider>
              <header className="header flex flex-col w-full background">
                <Header />
                <NavBar />
                <div className="bg-designAccent h-1"></div>
              </header>
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
