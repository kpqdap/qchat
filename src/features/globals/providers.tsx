"use client"
import { SessionProvider } from "next-auth/react"
import { AppInsightsProvider } from "../insights/app-insights-provider"
import { GlobalMessageProvider } from "./global-message-context"
import { MenuProvider } from "../main-menu/menu-context"
import { MiniMenuProvider } from "../main-menu/mini-menu-context"
import { TooltipProvider } from "@/features/ui/tooltip-provider"

export const Providers = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <SessionProvider refetchInterval={15 * 60} basePath="/api/auth">
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
