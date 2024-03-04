"use client";
import { AppInsightsProvider } from "./insights/app-insights-provider";
import { SessionProvider } from "next-auth/react";
import { GlobalMessageProvider } from "./global-message/global-message-context";
import { MenuProvider } from "./main-menu/menu-context";
import { MiniMenuProvider } from "./main-menu/mini-menu-context";
import { TooltipProvider } from "@/features/ui/tooltip-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppInsightsProvider>
      <SessionProvider refetchInterval={5 * 60} basePath="/api/auth">
        <GlobalMessageProvider>
          <MenuProvider>
            <MiniMenuProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </MiniMenuProvider>
          </MenuProvider>
        </GlobalMessageProvider>
      </SessionProvider>
    </AppInsightsProvider>
  );
};
