"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  return (
    <Tabs
      defaultValue={theme}
      className="flex flex-row rounded-full overflow-hidden"
    >
      <TabsList className="flex flex-row items-center justify-center flex-1"> 
        <TabsTrigger
          value="dark"
          onClick={() => setTheme("dark")}
          className="h-[40px] w-[40px] rounded-full"
        >
          <Moon size={18} />
        </TabsTrigger>
        <TabsTrigger
          value="light"
          onClick={() => setTheme("light")}
          className="h-[40px] w-[40px] rounded-full"
        >
          <Sun size={18} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
