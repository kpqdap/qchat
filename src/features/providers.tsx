"use client"
import { SessionProvider } from "next-auth/react"
import { AppInsightsProvider } from "./insights/app-insights-provider"
import { GlobalMessageProvider } from "./global-message/global-message-context"
import { MenuProvider } from "./main-menu/menu-context"
import { MiniMenuProvider } from "./main-menu/mini-menu-context"
import { TooltipProvider } from "@/components/ui/tooltip-provider"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider basePath="/api/auth">
      {/* <SessionProvider refetchInterval={15 * 60} basePath="/api/auth"> */}
      <AppInsightsProvider>
        <GlobalMessageProvider>
          <MenuProvider>
            <MiniMenuProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </MiniMenuProvider>
          </MenuProvider>
        </GlobalMessageProvider>
      </AppInsightsProvider>
    </SessionProvider>
  )
}
