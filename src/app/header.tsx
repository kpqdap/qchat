import React from 'react';
import { Mail } from 'lucide-react';
import QgovSvg from '@/components/ui/qldgovlogo';
import Typography from "@/components/typography";
import UserComponent from '@/components/ui/user-login-logout';

const Sidebar: React.FC = () => {
    return (
        <div className="flex items-center h-full space-x-4 lg:space-x-8">
            {/* Hide QgovSvg on smaller screens */}
            <div className="hidden lg:block">
                <QgovSvg />
            </div>
            <div className="hidden lg:block flex h-12 w-0.5 bg-lime-500"></div> {/* Vertical line */}
            <div className="flex flex-col items-left">
                <Typography variant="h3" className="lg:block">QChat</Typography>
                <Typography variant="h5" className="lg:block">The Queensland Government AI Assistant</Typography>
            </div>
        </div>
    );
};


const Header: React.FC = () => {
    return (
        <div className="background " role="banner">
            <div className="bg-[#09549F] text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="https://qchat.ai.qld.gov.au" className="flex items-center">
                        <Typography variant="h5">qchat.ai.qld.gov.au</Typography>
                    </a>

                    <div>
                        <UserComponent />
                    </div>
                </div>
            </div>

            <div className="foreground p-4">
                <div className="container mx-auto flex items-center">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default Header;
