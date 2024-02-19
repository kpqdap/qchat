"use client";

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut } from 'lucide-react';
import Typography from "@/components/typography";
import { Button } from '@/components/ui/button';

export const UserComponent: React.FC = () => {
    const { data: session } = useSession({ required: false });

    const signInProvider = process.env.NODE_ENV === 'development' ? 'credentials' : 'azure-ad';

    return (
        <div>
            {session ? (
                <Button onClick={() => signOut({ callbackUrl: '/', redirect: true })} className="flex items-center" aria-label="Log out">
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true"/>
                    <Typography variant="span">Log out</Typography>
                </Button>
            ) : (
                <Button onClick={() => signIn(signInProvider)} className="flex items-center" aria-label="Log in">
                    <LogIn className="w-4 h-4 mr-2" aria-hidden="true"/>
                    <Typography variant="span">Log in</Typography>
                </Button>
            )}
        </div>
    );
};
