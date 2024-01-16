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
              <div className="flex flex-col w-full h-full">
                <Header />
              </div>
                <div className="flex flex-col w-full h-full">
                  <div
                    className={cn(
                      notoSans.className,
                      "flex w-full p-2 h-full gap-2 bg-primary"
                    )}
                  >
                    {children}
                  </div>
                </div>
              
              <Toaster />
            </ThemeProvider>
          </Providers>
        </GlobalConfigProvider>
        <div className="flex flex-col w-full h-full">
          <Footer />
          </div>
      </body>
    </html>
  );
}
