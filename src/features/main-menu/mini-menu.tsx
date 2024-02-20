"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useMiniMenuContext } from "./mini-menu-context";
import { Menu, X, LogIn, LogOut, Moon, Sun, Home, Bookmark, Bell, UserCog } from 'lucide-react';
import { useTheme } from 'next-themes';
import Typography from "@/components/typography";

export const MiniMenu: React.FC = () => {
    const { isMenuOpen, toggleMenu } = useMiniMenuContext();
    const { data: session } = useSession({ required: false });
    const { theme, setTheme } = useTheme();

    const menuItems = [
        { name: 'Home', href: '/', icon: Home, ariaLabel: 'Navigate to home page' },
        { name: 'Prompt Guides', href: '/prompt-guide', icon: Bookmark, ariaLabel: 'Navigate to prompt guides' },
        { name: "What's New", href: '/whats-new', icon: Bell, ariaLabel: "Navigate to what's new page" },
        { name: 'My Settings', href: '/my-settings', icon: UserCog, ariaLabel: 'Navigate to my settings' }
    ];

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="relative">
            <Button
                onClick={toggleMenu}
                className=" p-1 text-darkAltButton bg-darkbackground  hover:bg-buttonHover flex items-center"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                variant="link"
            >
                {isMenuOpen ? <X className="w-4 h-4 mr-2 text-darkAltButton" aria-hidden="true"/> : <Menu className="w-4 h-4 mr-2 text-darkAltButton" aria-hidden="true"/> }
            </Button>
            <Typography variant="span">Menu</Typography>
            {isMenuOpen && (
                <div className="fixed top-0 right-0 bottom-0 left-0 z-[99999] bg-background" role="dialog" aria-modal="true" aria-labelledby="menu-heading">
                    <div className="absolute top-0 right-0 m-4">
                        <Button
                            onClick={toggleMenu}
                            className="w-[40px] h-[40px] p-1 text-accent-foreground hover:text-secondary"
                            variant="destructive"
                            aria-label="Close menu"
                        >
                            <X />
                        </Button>
                    </div>
                    <h2 id="menu-heading" className="sr-only">Menu</h2>
                    <div className="p-4 mt-16">
                        {menuItems.map((item) => (
                            <Link href={item.href} key={item.href} passHref>
                                <div className={`cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap`}
                                   aria-label={item.ariaLabel}>
                                    <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                                    {item.name}
                                </div>
                            </Link>
                        ))}
                        <button
                            onClick={toggleTheme}
                            className="cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap"
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        {session ? (
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap"
                                aria-label="Logout"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => signIn()}
                                className="cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap"
                                aria-label="Login"
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                Login
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};