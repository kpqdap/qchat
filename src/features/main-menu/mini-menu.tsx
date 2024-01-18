"use client";

import React, { useState } from 'react';
import { Menu, X, LogIn, LogOut, Moon, Sun, Home as HomeIcon, Bookmark as BookMarked, Bell as BellPlus, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const MiniMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession({ required: false });
    const { theme, setTheme } = useTheme();

    const menuItems = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Prompt Guides', href: '/prompt-guide', icon: BookMarked },
        { name: "What's New", href: '/whats-new', icon: BellPlus },
        { name: 'My Settings', href: '/my-settings', icon: UserCog }
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

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
                {isOpen ? <X /> : <Menu />}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 shadow-md rounded-lg flex flex-col items-stretch w-48">
                    {menuItems.map(item => (
                        <Link href={item.href} key={item.name}>
                            <div className="cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap">
                                <item.icon className="w-4 h-4 mr-2" />
                                {item.name}
                            </div>
                        </Link>
                    ))}
                    <div onClick={toggleTheme} className="cursor-pointer px-6 py-2 text-sm bg-background hover:bg-accent hover:text-accent-foreground text-primary flex items-center whitespace-nowrap">
                        {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </div>

                    {/* Conditional menu items based on logged-in state */}
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
            )}
        </div>
    );
};

export default MiniMenu;
