import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/features/ui/toaster";
import { GlobalConfigProvider } from "@/features/global-config/global-client-config-context";
import { Providers } from "@/features/providers";
import { AI_NAME } from "@/features/theme/customise";
import { cn } from "@/lib/utils";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "./header";
import { Footer } from "./footer";
import { NavBar } from '@/features/ui/navbar';

export const dynamic = "force-dynamic";

const notoSans = Noto_Sans({ subsets: ["latin"] });

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
    <html lang="en" className="h-full w-full overflow-hidden text-sm">
      <body className={cn(notoSans.className, "h-full w-full flex flex-col min-w-[400px] bg-background")}>
        <GlobalConfigProvider>
          <Providers>
            <ThemeProvider>
              <header className="header flex flex-col w-full background xs:h-full sm:h-1/6">
                <Header />
              </header>
              <nav className="nav flex flex-col w-full background">
                <NavBar />
              </nav>
              {/* <main className="main grid grid-cols-6 w-full h-5/6 bg-background"> */}
              <main className="main w-full h-5/6 bg-background">
                {children}
                {/* <div className={cn("col-span-6 w-full gap-2 bg-primary h-full")}>
                
                </div> */}
              </main>
              {/* <Footer /> */}
              <Toaster />
            </ThemeProvider>
          </Providers>
        </GlobalConfigProvider>
      </body>
    </html>
  );
}
