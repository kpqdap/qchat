import React from 'react';
import { Mail } from 'lucide-react';
import { QgovSvg } from '@/components/ui/qldgovlogo';
import Typography from "@/components/typography";

export const Footer: React.FC = () => {
    return (
        <div className="background " role="banner">
            <div className="bg-[#09549F] text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <a href="https://qchat.ai.qld.gov.au" className="flex items-center">
                        <Typography variant="h5">qchat.ai.qld.gov.au</Typography>
                    </a>

                    <div>
                        <a href="mailto:qchat@chde.qld.gov.au" className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            <Typography variant="h5">Contact us</Typography>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};