import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";

export class UserSignInHandler {
  static async handleSignIn(user: UserRecord, groupsString?: string): Promise<boolean> {
    const userContainer = new CosmosDBUserContainer();
    const tenantContainerExtended = new CosmosDBTenantContainerExtended();

    try {
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
      if (!tenant && userGroups.length > 0) {
        const accessGroups = process.env.ACCESS_GROUPS ? process.env.ACCESS_GROUPS.split(',') : [];
        const isUserGroupApproved = userGroups.some(userGroup => accessGroups.includes(userGroup));
        console.log(`User groups: ${userGroups.join(', ')}`);
        console.log(`Access groups: ${accessGroups.join(', ')}`);
        console.log(`Group approval result: ${isUserGroupApproved}`);
        if (!isUserGroupApproved) {
          return false;
        }
      } else if (tenant && tenant.requiresGroupLogin) {
        if (userGroups.length === 0) {
          return false;
        }

        const groupsApproved = await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString || "");
        console.log(`Checking groups for tenant ${user.tenantId}: ${groupsString || "No groups provided"}`);
        console.log(`Groups approved: ${groupsApproved}`);
        if (!groupsApproved) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }
};
