"use client"

import React from "react"
import { HomeIcon, BookMarked, HeartHandshake } from "lucide-react"
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
    { name: "Prompt Guides", href: "/prompt-guide", icon: BookMarked, condition: () => !!session },
    { name: "Terms of Use", href: "/terms", icon: HeartHandshake, condition: () => !!session },
    // { name: "Reporting", href: "/reporting", icon: FileLineChart, condition: () => !!session },
    // { name: "Settings", href: "/settings", icon: UserCog, condition: () => !!session },
    // You can easily add more links here with or without conditions
  ]

  const visibleLinks = links.filter(link => !link.condition || link.condition())

  return (
    <nav aria-label="Main navigation" className="border-accent bg-backgroundShade border-b-4">
      <div className="container mx-auto hidden md:block">
        <div dir="ltr" className="justify grid grid-cols-12 gap-2">
          {visibleLinks.map((link, index) => (
            <div key={index} className="items-centre relative col-span-2 flex space-x-2">
              <a href={link.href} className="hover:bg-altBackground group flex w-full items-center justify-center py-2">
                {link.icon &&
                  React.createElement(link.icon, {
                    className: "h-8 w-5 mr-2",
                    "aria-hidden": true,
                  })}
                <Typography variant="h3">{link.name}</Typography>
                <div className="border-darkAltButton absolute inset-x-0 bottom-0 border-b-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </a>
            </div>
          ))}
          <div className="min:h-[40px] col-span-6 flex justify-end">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </nav>
  )
}
