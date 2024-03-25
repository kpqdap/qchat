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
  condition?: (sessionStatus: string) => boolean
}

export const NavBar: React.FC = () => {
  const { data: _session, status } = useSession()

  if (status === "loading") {
    return (
      <nav aria-label="Main navigation" className="border-accent bg-backgroundShade m:h-[44px] border-b-4">
        {" "}
        <div className="container mx-auto hidden md:block">
          <div className="grid grid-cols-12 gap-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="relative col-span-2 flex items-center space-x-2">
                <div className="flex w-full animate-pulse items-center justify-center py-2">
                  <div className="mr-2 h-9 w-5 rounded bg-gray-300"></div>
                  <div className="h-8 w-24 rounded bg-gray-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    )
  }

  const links: LinkItem[] = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Prompt Guides", href: "/prompt-guide", icon: BookMarked, condition: status => status === "authenticated" },
    { name: "Terms of Use", href: "/terms", icon: HeartHandshake, condition: status => status === "authenticated" },
    // Further links can be added with or without conditions
  ]

  const visibleLinks = links.filter(link => !link.condition || (link.condition && link.condition(status)))

  return (
    <nav aria-label="Main navigation" className="border-accent bg-backgroundShade m:h-[44px] block border-b-4">
      <div className="container mx-auto hidden md:block">
        <div dir="ltr" className="grid grid-cols-12 gap-2">
          {visibleLinks.map((link, index) => (
            <div key={index} className="relative col-span-2 flex items-center space-x-2">
              <a href={link.href} className="hover:bg-altBackground group flex w-full items-center justify-center py-2">
                {link.icon &&
                  React.createElement(link.icon, {
                    className: "h-8 w-5 mr-2",
                    "aria-hidden": "true",
                  })}
                <Typography variant="h3">{link.name}</Typography>
                <div className="border-darkAltButton absolute inset-x-0 bottom-0 border-b-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </a>
            </div>
          ))}
          <div className="col-span-6 flex min-h-[40px] items-center justify-end">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </nav>
  )
}
