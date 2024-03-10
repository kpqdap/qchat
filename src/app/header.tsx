import React from 'react'
import { QgovSvg } from '@/components/ui/qldgovlogo'
import { QgovMiniSvg } from '@/components/ui/qldgovminilogo'
import Typography from "@/components/typography"
import { UserComponent } from '@/components/ui/user-login-logout'
import { MiniMenu } from '@/features/main-menu/mini-menu'
import { AI_NAME } from '@/features/theme/customise'

const Sidebar: React.FC = () => {
    return (
        <div className="grid h-full grid-cols-12 items-center gap-2 md:grid-cols-6">
          <div className="col-span-2 hidden border-r-2 border-accent md:col-span-2 md:block md:scale-75">
            <QgovSvg />
          </div>
          <div className="col-span-4 flex flex-col md:col-span-3">
            <Typography variant="h1" className="custom-title text-siteTitle">
              {AI_NAME}
            </Typography>
            <Typography variant="h2" className="custom-subtitle hidden whitespace-nowrap pb-0 text-textMuted sm:block">
              The Queensland Government AI Assistant
            </Typography>
          </div>
          <div className="col-span-6 hidden md:col-span-1 md:block"></div>
        </div>
      )
    }

export const Header: React.FC = () => {
    return (
        <div className="header-content h-full">
          <div className="h-full bg-darkbackground text-white sm:h-3/6 md:h-2/6">
            <div className="mx-auto flex h-full items-center justify-between">
              <div className="scale block md:hidden lg:hidden">
                <QgovMiniSvg />
              </div>
              <div className="container mx-auto hidden w-full grid-cols-3 items-center md:grid">
                <Typography variant="span" aria-label="Site domain: qchat.ai.qld.gov.au" className="col-span-2">
                  qchat.ai.qld.gov.au
                </Typography>
                <div className="justify-self-end">
                  <UserComponent />
                </div>
              </div>
              <div className="block h-full grid-cols-4 flex-col md:hidden ">
                <MiniMenu />
              </div>
            </div>
          </div>
          <div className="foreground hidden h-3/6 bg-altBackground py-2 sm:block md:h-4/6">
            <div className="container mx-auto flex items-center">
              <Sidebar />
            </div>
            </div>
    </div>
  )
}