import React from 'react';
import { Mail } from 'lucide-react';
import QgovSvg from '@/components/ui/qldgovlogo';
import Typography from "@/components/typography";

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


const footer: React.FC = () => {
    return (
        <footer className="background " role="banner">
            <div className="bg-[#09549F] text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="https://www.qld.gov.au" className="flex items-center">
                        <Typography variant="h5">qchat.qld.gov.au</Typography>
                    </a>

                    <div>
                        <a href="mailto:qchat@chde.qld.gov.au" className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            <Typography variant="h5">Contact us</Typography>
                        </a>
                    </div>
                </div>
            </div>

            <div className="foreground p-4">
                <div className="container mx-auto flex items-center">
                    <Sidebar />
                </div>
            </div>
        </footer>
    );
};

export default footer;
