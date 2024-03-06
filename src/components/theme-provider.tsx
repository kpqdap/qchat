"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import React, { ReactNode } from "react"

export const ThemeProvider = ({ children, ...props }: { children: ReactNode }): JSX.Element => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={true} {...props}>
      {children}
    </NextThemesProvider>
  )
}
