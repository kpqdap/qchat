"use client";

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut } from 'lucide-react';
import Typography from "@/components/typography";
import { Button } from '@/components/ui/button';

export const UserComponent: React.FC = () => {
    const { data: session } = useSession({ required: false });

    return (
        <div>
            {session ? (
                <Button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center" aria-label="Log out">
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true"/>
                    <Typography variant="span">Log out</Typography>
                </Button>
            ) : (
                <button onClick={() => signIn()} className="flex items-center" aria-label="Log in">
                    <LogIn className="w-4 h-4 mr-2" aria-hidden="true"/>
                    <Typography variant="span">Log in</Typography>
                </button>
            )}
        </div>
    );
};
