"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useMiniMenuContext } from "./mini-menu-context";
import { Menu, X, LogIn, LogOut, Moon, Sun, Home, Bookmark, Bell, UserCog } from 'lucide-react';
import { useTheme } from 'next-themes';

export const MiniMenu: React.FC = () => {
    const { isMenuOpen, toggleMenu } = useMiniMenuContext();
    const { data: session } = useSession({ required: false });
    const { theme, setTheme } = useTheme();

    const menuItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Prompt Guides', href: '/prompt-guide', icon: Bookmark },
        { name: "What's New", href: '/whats-new', icon: Bell },
        { name: 'My Settings', href: '/my-settings', icon: UserCog }
    ];

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="relative">
            <Button
                onClick={toggleMenu}
                className="w-[40px] h-[40px] p-1 text-accent-foreground hover:text-secondary"
                variant="ghost"
            >
                {isMenuOpen ? <X /> : <Menu />}
            </Button>
            {isMenuOpen && (
                <div className="fixed top-0 right-0 bottom-0 left-0 z-[99999] bg-background">
                    <div className="absolute top-0 right-0 m-4">
                        <Button
                            onClick={toggleMenu}
                            className="w-[40px] h-[40px] p-1 text-accent-foreground hover:text-secondary"
                            variant="destructive"
                        >
                            <X />
                        </Button>
                    </div>
                    <div className="p-4 mt-16">
                        {menuItems.map((item, index) => (
                            <Link href={item.href} key={item.href}>
                                <div className={`cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap ${index === 0 ? 'mt-2' : ''}`}>
                                    <item.icon className="w-4 h-4 mr-2" />
                                    {item.name}
                                </div>
                            </Link>
                        ))}
                        <div onClick={toggleTheme} className="cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap">
                            {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </div>
                        {session ? (
                            <div onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </div>
                        ) : (
                            <div onClick={() => signIn()} className="cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap">
                                <LogIn className="w-4 h-4 mr-2" />
                                Login
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

