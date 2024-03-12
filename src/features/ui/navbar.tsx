"use client"

import React from "react"
import { HomeIcon, UserCog, FileLineChart } from "lucide-react"
import Typography from "@/components/typography"
import { ThemeSwitch } from "@/features/theme/theme-switch"
import { useSession } from "next-auth/react"

interface LinkItem {
  name: string
  href: string
  icon?: React.ElementType
  condition?: () => boolean
}

export const NavBar: React.FC = () => {
  const { data: session, status } = useSession()
  if (status === "unauthenticated") return null
  const links: LinkItem[] = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Settings", href: "/settings", icon: UserCog, condition: () => !!session },
    { name: "Reporting", href: "/reporting", icon: FileLineChart, condition: () => !!session },
    // You can easily add more links here with or without conditions
  ]

  const visibleLinks = links.filter(link => !link.condition || link.condition())

  return (
    <nav aria-label="Main navigation" className="bg-backgroundShade border-b-4 border-accent">
      <div className="container mx-auto hidden md:block">
        <div dir="ltr" className="grid grid-cols-12 gap-2 items-center">
          {visibleLinks.map((link, index) => (
            <div key={index} className="col-span-2 flex items-center space-x-2 relative">
              <a href={link.href} className="flex items-center justify-center w-full py-2 hover:bg-altBackground group">
                {link.icon &&
                  React.createElement(link.icon, {
                    className: "h-8 w-5 mr-2",
                    "aria-hidden": true,
                  })}
                <Typography variant="h3">{link.name}</Typography>
                <div className="absolute bottom-0 inset-x-0 border-b-4 border-darkAltButton opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          ))}
          <div className="col-span-6 flex justify-end min:h-[40px]">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </nav>
  )
}
