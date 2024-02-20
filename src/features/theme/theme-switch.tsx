"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();
  const [defaultTab, setDefaultTab] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (resolvedTheme) {
      setDefaultTab(resolvedTheme);
      setIsLoading(false);
    }
  }, [resolvedTheme]);

  const handleTabChange = (value: string) => {
    setDefaultTab(value);
    setTheme(value);
  };

  if (isLoading) {
    return <span>Loading theme</span>;
  }

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList aria-label="Theme Switch" className="flex flex-row items-center justify-center flex-1 gap-1 bg-backgroundShade">
        <TabsTrigger
          value="dark"
          onClick={() => handleTabChange("dark")}
          className={`h-[40px] w-[40px] rounded-md focus:ring text-altButton hover:bg-altBackgroundShade hover:text-altButton`}
          role="button"
          aria-label="Switch to dark mode"
          tabIndex={0}
        >
          <Moon size={18} />
        </TabsTrigger>
        <TabsTrigger
          value="light"
          onClick={() => handleTabChange("light")}
          className={`h-[40px] w-[40px] rounded-md focus:ring text-altButton hover:bg-altBackgroundShade hover:text-altButton`}
          role="button"
          aria-label="Switch to light mode"
          tabIndex={0}
        >
          <Sun size={18} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
