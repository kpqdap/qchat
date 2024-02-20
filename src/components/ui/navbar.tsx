import React from 'react';
import { HomeIcon, UserCog, BellPlus, BookMarked } from 'lucide-react';
import Typography from "@/components/typography";
import { ThemeSwitch } from '@/features/theme/theme-switch';

interface IconProps {
  className: string;
  'aria-hidden'?: boolean;
}

interface LinkItem {
  name: string;
  href: string;
  icon?: React.ElementType;
}

export const NavBar: React.FC = () => {
    const links: LinkItem[] = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Prompt Guides', href: '/prompt-guide', icon: BookMarked },
        { name: "What's New", href: '/whats-new', icon: BellPlus },
        { name: 'My Settings', href: '/my-settings', icon: UserCog }
    ];

    return (
        <nav aria-label="Main navigation" className="bg-secondary p-2 hidden md:block">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <ol className="flex space-x-10">
                        {links.map((link, index) => (
                            <li key={index} className="flex items-center">
                                <a href={link.href} className="flex items-center" aria-label={link.name}>
                                    {link.icon && (
                                        React.createElement(link.icon, {
                                            className: "h-8 w-5 mr-2",
                                            'aria-hidden': true
                                        })
                                    )}
                                    <Typography variant="h3">{link.name}</Typography>
                                </a>
                            </li>
                        ))}
                    </ol>
                    <ThemeSwitch />
                </div>
            </div>
        </nav>
    );
};
