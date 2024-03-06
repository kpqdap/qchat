import React, { createContext, useContext, useState } from "react"

interface MiniMenuContextProps {
  isMenuOpen: boolean
  toggleMenu: () => void
}

export const MiniMenuContext = createContext<MiniMenuContextProps>({
  isMenuOpen: false,
  toggleMenu: () => {},
})

export const MiniMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return <MiniMenuContext.Provider value={{ isMenuOpen, toggleMenu }}>{children}</MiniMenuContext.Provider>
}

export const useMiniMenuContext = () => useContext(MiniMenuContext)
