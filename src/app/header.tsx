import React from 'react';
import QgovSvg from '@/components/ui/qldgovlogo';
import Typography from "@/components/typography";
import UserComponent from '@/components/ui/user-login-logout';
import MiniMenu from '@/features/main-menu/mini-menu';

const Sidebar: React.FC = () => {
    return (
        <div className="flex items-center h-full space-x-4 lg:space-x-8">
            <div className="hidden md:block">
                <QgovSvg />
            </div>
            <div className="hidden md:block h-12 w-0.5 bg-lime-500"></div>
            <div className="flex flex-col items-left">
                <Typography variant="h1" className="block">QChat</Typography>
                <Typography variant="h3" className="block">The Queensland Government AI Assistant</Typography>
            </div>
        </div>
    );
};

const Header: React.FC = () => {
    return (
        <div className="background" role="banner">
            <div className="bg-[#09549F] text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    {/* QGovSvg wrapped in div for responsive styling */}
                    <div className="block md:hidden lg:hidden scale-75 sm:scale-100">
                        <QgovSvg />
                    </div>
                    <Typography variant="h5" className="hidden md:block lg:block">qchat.ai.qld.gov.au</Typography>

                    <div className="hidden md:block">
                        <UserComponent />
                    </div>
                    <div className="block md:hidden">
                        <MiniMenu />
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
