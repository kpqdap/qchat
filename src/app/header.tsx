import React from "react"
import { QgovSvg } from "@/features/ui/qldgovlogo"
import { QgovMiniSvg } from "@/features/ui/qldgovminilogo"
import Typography from "@/components/typography"
import { UserComponent } from "@/features/ui/user-login-logout"
import { MiniMenu } from "@/features/main-menu/mini-menu"
import { AI_NAME } from "@/features/theme/theme-config"

const Sidebar: React.FC = () => {
  return (
    <div className="grid h-full grid-cols-12 items-center gap-2 md:grid-cols-6">
      <div className="border-accent col-span-2 hidden border-r-2 md:col-span-2 md:block md:scale-75">
        <QgovSvg />
      </div>
      <div className="col-span-4 flex flex-col md:col-span-3">
        <Typography variant="h1" className="text-siteTitle">
          {AI_NAME}
        </Typography>
        <Typography variant="h2" className="text-textMuted hidden whitespace-nowrap pb-0 sm:block">
          The Queensland Government AI Assistant
        </Typography>
      </div>
      <div className="col-span-6 hidden md:col-span-1 md:block"></div>
    </div>
  )
}

export const Header: React.FC = () => {
  return (
    <header className="xs:h-[32px] flex w-full flex-col sm:h-[98px]">
      <div className="bg-darkbackground h-[32px] text-white">
        <div className="mx-auto flex h-full items-center justify-between px-8 py-2">
          <div className="block md:hidden lg:hidden">
            <QgovMiniSvg />
          </div>
          <div className="container mx-auto hidden h-[32px] w-full grid-cols-3 items-center md:grid">
            <Typography variant="span" aria-label="Site domain: qchat.ai.qld.gov.au" className="col-span-2">
              qchat.ai.qld.gov.au
            </Typography>
            <div className="justify-self-end">
              <UserComponent />
            </div>
          </div>
          <div className="block h-[32px] grid-cols-4 flex-col py-2 md:hidden ">
            <MiniMenu />
          </div>
        </div>
      </div>
      <div className="bg-altBackground block py-2 sm:h-[66px]">
        <div className="container mx-auto flex items-center">
          <Sidebar />
        </div>
      </div>
    </header>
  )
}
