"use client";

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut } from 'lucide-react';
import Typography from "@/components/typography";

const UserComponent: React.FC = () => {
    const { data: session } = useSession({ required: false });

    return (
        <div>
            {session ? (
                <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    <Typography variant="h5">Log out</Typography>
                </button>
            ) : (
                <button onClick={() => signIn()} className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    <Typography variant="h5">Log in</Typography>
                </button>
            )}
        </div>
    );
};

export default UserComponent;
