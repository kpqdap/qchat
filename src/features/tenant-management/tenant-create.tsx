import React from 'react';
import Typography from "@/components/typography";
import { Button } from '@/components/ui/button';
import { CosmosDBTenantContainer, TenantRecord } from './tenant-cosmos';

export const TenantCreate: React.FC = () => {
    const cosmosDBTenantContainer = new CosmosDBTenantContainer();

    const handleCreateTenant = async () => {
        console.log("Creating tenant...");

        const uniqueTenantId = 'localdev';

        const tenant: TenantRecord = {
            tenantId: uniqueTenantId,
            primaryDomain: 'tenantdomain.com',
            requiresGroupLogin: false,
            id: '',
            email: undefined,
            supportEmail: undefined,
            dateCreated: undefined,
            dateUpdated: undefined,
            dateOnBoarded: undefined,
            dateOffBoarded: undefined,
            modifiedBy: undefined,
            createdBy: undefined,
            departmentName: undefined,
            groups: undefined,
            administrators: undefined,
            features: undefined,
            serviceTier: undefined
        };

        try {
            await cosmosDBTenantContainer.createTenant(tenant);
            console.log("Tenant created successfully with hashed tenantId");
        } catch (error) {
            console.error("Failed to create tenant", error);
        }
    };

    return (
        <div>
            <Button onClick={handleCreateTenant} className="ml-4 flex items-center bg-primary text-white" aria-label="Create Tenant" variant="link">
                <Typography variant="span">Create Tenant</Typography>
            </Button>
        </div>
    );
};
