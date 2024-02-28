"use client";

import React from 'react';
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useMiniMenuContext } from "./mini-menu-context";
import { Menu, X, LogIn, LogOut, Moon, Sun, Home, Bookmark, Bell, UserCog } from 'lucide-react';
import { useTheme } from "next-themes";
import { Theme } from '../theme/customise';
import { UrlObject } from "url";
import RouteImpl from "next/types/index.js";
import { cn } from '@/lib/utils';

const getSignInProvider = () => {
    return process.env.NODE_ENV === "development" ? "QChatDevelopers" : "azure-ad";
  };
  
  export default getSignInProvider;

type RouteImpl = any

interface MiniMenuItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
    href: UrlObject | RouteImpl;
    icon: React.ElementType;
    name: string;
    ariaLabel: string;
    onClick: () => void;
};

const MiniMenuItem: React.FC<MiniMenuItemProps> = ({ href, icon: Icon, name, ariaLabel, onClick, ...props }) => {
const menuItemClass = cn(
    "cursor-pointer px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center whitespace-nowrap",
    props.className
    );

    return (
    <div
        className={menuItemClass}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
    >
        <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
        {name}
        <Link href={href} passHref>
        <span style={{ display: "none" }}></span>
        </Link>
    </div>
    );
};
  
export const MiniMenu: React.FC = () => {
    const { isMenuOpen, toggleMenu } = useMiniMenuContext();
    const { data: session } = useSession({ required: false });
    const { theme, setTheme } = useTheme();

    const menuItems = [
        { name: 'Home', href: '/chat', icon: Home, ariaLabel: 'Navigate to home page' }
        // { name: 'Prompt Guides', href: '/prompt-guide', icon: Bookmark, ariaLabel: 'Navigate to prompt guides' },
        // { name: "What's New", href: '/whats-new', icon: Bell, ariaLabel: "Navigate to what's new page" },
        // { name: 'Settings', href: '/settings', icon: UserCog, ariaLabel: 'Navigate to settings' },
    ];

    const toggleTheme = () => {
        const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
        setTheme(newTheme);
    };

    const handleMenuClose = () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    };

    return (
        <>
            <div
                onClick={toggleMenu}
                className="cursor-pointer flex p-4 text-darkAltButton flex-col relative hover:bg-background hover:underline border-l-2 border-accent h-full items-center"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                role="button"
                tabIndex={0}
            >
                {isMenuOpen ? <X className="hover:bg-link items-center" aria-hidden="true"/> : <Menu size={16} className="text-darkAltButton" aria-hidden="true"/>}
                Menu
            </div>
            {isMenuOpen && (
                <div className="fixed top-0 right-0 bottom-0 left-0 z-[99999] bg-altBackground text-link" role="dialog" aria-modal="true">
                    <div className="absolute top-0 right-0 m-4 h-2/6">
                        <div
                            onClick={toggleMenu}
                            className="w-[32px] h-[32px] p-1 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            aria-label="Close menu"
                            role="button"
                            tabIndex={0}
                        >
                            <X />
                        </div>
                    </div>
                    <h2 id="menu-heading" className="sr-only">Menu</h2>
                    <div className="p-2 mt-16">
                        {menuItems.map((item) => (
                            <MiniMenuItem key={item.name} onClick={handleMenuClose} {...item} />
                            ))}
                            <div
                                onClick={() => { toggleTheme(); handleMenuClose(); }}
                                className="cursor-pointer px-6 py-2 text-sm text-link hover:bg-accent hover:text-accent-foreground flex items-center whitespace-nowrap"
                                aria-label={theme === Theme.Dark ? 'Switch to light mode' : 'Switch to dark mode'}
                                role="button"
                                tabIndex={0}
                            >
                                {theme === Theme.Dark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                                {theme === Theme.Dark ? 'Light Mode' : 'Dark Mode'}
                            </div>
                        {session ? (
                            <div
                                onClick={() => { signOut({ callbackUrl: '/' }); handleMenuClose(); }}
                                className="cursor-pointer px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center whitespace-nowrap"
                                aria-label="Logout"
                                role="button"
                                tabIndex={0}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </div>
                        ) : (
                            <div
                                onClick={() => { signIn(getSignInProvider()); handleMenuClose(); }}
                                className="cursor-pointer px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center whitespace-nowrap"
                                aria-label="Login"
                                role="button"
                                tabIndex={0}
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                Login
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};