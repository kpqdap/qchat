import React from 'react';
import { HomeIcon, UserCog, BellPlus, BookMarked } from 'lucide-react';
import Typography from "@/components/typography";
import { ThemeSwitch } from '@/features/theme/theme-switch';

interface LinkItem {
    name: string;
    href: string;
    icon?: React.ElementType;
}

const NavBar: React.FC = () => {
    const links: LinkItem[] = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Prompt Guides', href: '/prompt-guide', icon: BookMarked },
        { name: "What's New", href: '/whats-new', icon: BellPlus },
        { name: 'My Settings', href: '/my-settings', icon: UserCog }
    ];

    return (
        <nav className="bg-secondary p-4 hidden md:block">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <ul className="flex space-x-10">
                        {links.map((link, index) => (
                            <li key={index} className="prose prose-slate dark:prose-invert">
                                <a href={link.href} className="flex items-center">
                                    {link.icon && (
                                        <link.icon className="h-8 w-5 mr-2" aria-hidden="true" />
                                    )}
                                    <Typography variant="h5" className="flex items-center">{link.name}</Typography>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <ThemeSwitch />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
