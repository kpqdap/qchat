"use client"

import React from "react"
import { useTheme } from "next-themes"
import { Theme } from "./customise"
import { Moon, Sun } from "lucide-react"

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => setTheme(Theme.Dark)}
        aria-label="Set dark theme"
        className={`${theme === Theme.Dark ? "bg-gray-800 text-white" : "bg-gray-200"} p-2 rounded-full`}
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => setTheme(Theme.Light)}
        aria-label="Set light theme"
        className={`${theme === Theme.Light ? "bg-yellow-500 text-white" : "bg-gray-200"} p-2 rounded-full`}
      >
        <Sun size={18} />
      </button>
    </div>
  )
}
