import React from 'react';
import { Menu, MenuContent, MenuHeader, MenuItem } from "@/components/menu";
import { FileText, MessageCircle, Settings, HelpCircle } from 'lucide-react';

export const UserSettings = () => {
  return (
    <>
      <MenuItem href="/settings/personal-details">
        <FileText size={16} /> <span>Personal Details</span>
      </MenuItem>
      <MenuItem href="/settings/chat-history">
        <MessageCircle size={16} /> <span>Chat History</span>
      </MenuItem>
      <MenuItem href="/settings/qchat-preferences">
        <Settings size={16} /> <span>QChat Preferences</span>
      </MenuItem>
      <MenuItem href="/settings/help-support">
        <HelpCircle size={16} /> <span>Help & Support</span>
      </MenuItem>
    </>
  );
};
