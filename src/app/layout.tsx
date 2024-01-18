import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { GlobalConfigProvider } from "@/features/global-config/global-client-config-context";
import { Providers } from "@/features/providers";
import { AI_NAME } from "@/features/theme/customise";
import { cn } from "@/lib/utils";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Header from "./header";
import Footer from "./footer";
import NavBar from '@/components/ui/navbar';



export const dynamic = "force-dynamic";

const notoSans = Noto_Sans({ weight: '400', subsets: ["latin"] });

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full overflow-auto">
      <body className={cn(notoSans.className, "flex flex-col w-full h-full")}>
        <GlobalConfigProvider
          config={{ speechEnabled: process.env.PUBLIC_SPEECH_ENABLED }}
        >
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <header className="header flex flex-col w-full overflow-hidden">
                <Header />
                <NavBar />
              </header>
              <div className="bg-lime-500 h-1"></div>
                <main className="main flex flex-col w-full h-75vh">
                  <div
                    className={cn(
                      notoSans.className,
                      "flex w-full h-full gap-2 bg-primary"
                    )}
                  >
                    {children}
                  </div>
                </main>
              <Toaster />
            </ThemeProvider>
          </Providers>
        </GlobalConfigProvider>
      </body>
    </html>
  );
}
