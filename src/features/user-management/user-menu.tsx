import React, { ReactNode } from 'react';
import { Menu, MenuContent, MenuHeader } from "@/components/menu";
import { UserSettings } from "./menu-items";

interface UserSettingsMenuProps {
  children: ReactNode;
}

// Include `children` in the component's parameters to accept child components
export const UserSettingsMenu: React.FC<UserSettingsMenuProps> = ({ children }) => {
  return (
    <Menu className="p-2 bg-background hidden md:block overflow-auto">
      <MenuHeader className="justify-end">
        <h1>My Settings</h1>
      </MenuHeader>
      <MenuContent>
        {/* Render the UserSettings component */}
        <UserSettings />
        {/* Now, this will correctly render any children passed to UserSettingsMenu */}
        {children}
      </MenuContent>
    </Menu>
  );
};
