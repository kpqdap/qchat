"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalMessageProvider } from "./global-message/global-message-context";
import { MenuProvider } from "./main-menu/menu-context";
import { MiniMenuProvider } from "./main-menu/mini-menu-context";
import { TooltipProvider } from "@/components/ui/tooltip-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
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
  );
};
