import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";

export class UserSignInHandler {
  static async handleSignIn(user: UserRecord, groupsString?: string): Promise<boolean> {
    const userContainer = new CosmosDBUserContainer();
    const tenantContainerExtended = new CosmosDBTenantContainerExtended();

    try {
      const permittedTenantsRequired = process.env.PERMITTED_TENANTS_REQUIRED === "true";

      const existingUser = await userContainer.getUserByUPN(user.tenantId, user.upn ?? '');
      const userGroups = groupsString ? groupsString.split(',').map(group => group.trim()) : [];

      if (!existingUser) {
        await userContainer.createUser({
          ...user,
          first_login: new Date(),
          accepted_terms: false,
          accepted_terms_date: "",
          groups: userGroups,
        });
      } else {
        const currentTime = new Date();
        const updatedUser = {
          ...existingUser,
          last_login: currentTime,
          groups: userGroups,
        };

        await userContainer.updateUser(updatedUser, user.tenantId, user.userId);
      }

      const tenant = await tenantContainerExtended.getTenantById(user.tenantId);
      if (permittedTenantsRequired && !tenant) {
        console.log("Tenant not found or access not allowed.");
        return false;
      }

      if (userGroups.length > 0) {
        const accessGroups = process.env.ACCESS_GROUPS ? process.env.ACCESS_GROUPS.split(',') : [];
        const isUserGroupApproved = userGroups.some(userGroup => accessGroups.includes(userGroup));
        if (!isUserGroupApproved) {
          return false;
        }
      }

      if (tenant && tenant.requiresGroupLogin) {
        if (userGroups.length === 0 || !(await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString || ""))) {
          return false;
        }
      }

      return true; 
    } catch (error) {
      console.error("Error handling sign-in:", error);
      return false;
    }
  }
};
