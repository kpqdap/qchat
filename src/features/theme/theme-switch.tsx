"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export function ThemeSwitch(): JSX.Element {
  const { setTheme, resolvedTheme } = useTheme()
  const [isThemeLoading, setIsThemeLoading] = useState(true)

  useEffect(() => {
    setIsThemeLoading(!resolvedTheme)
  }, [resolvedTheme])

  const handleTabChange = (value: string): void => {
    setTheme(value)
  }

  if (isThemeLoading) {
    return <span>Loading theme...</span>
  }

  return (
    <Tabs defaultValue={resolvedTheme} aria-label="Theme Switch">
      <TabsList className="flex flex-row items-center justify-center gap-1 h-10">
        <TabsTrigger
          value="dark"
          onClick={() => handleTabChange("dark")}
          className="size-[35px] rounded-md focus:ring text-altButton hover:bg-altBackgroundShade hover:text-altButton"
          aria-label="Switch to dark mode"
        >
          <Moon size={18} />
        </TabsTrigger>
        <TabsTrigger
          value="light"
          onClick={() => handleTabChange("light")}
          className="size-[35px] rounded-md focus:ring text-altButton hover:bg-altBackgroundShade hover:text-altButton"
          aria-label="Switch to light mode"
        >
          <Sun size={18} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
