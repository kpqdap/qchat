import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";

export class UserSignInHandler {
  static async handleSignIn(user: UserRecord, groupsString?: string): Promise<boolean> {
    const userContainer = new CosmosDBUserContainer();
    const tenantContainerExtended = new CosmosDBTenantContainerExtended();

    try {
      const tenant = await tenantContainerExtended.getTenantById(user.tenantId);
      if (!tenant) {
        console.log("Tenant not found.");
        return false;
      }

      const userGroups = groupsString ? groupsString.split(',').map(group => group.trim()) : [];
      if (tenant.requiresGroupLogin) {
        if (userGroups.length === 0 || !(await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString || ""))) {
          console.log("Tenant group check failed.")
          return false;
        }
      }

      const existingUser = await userContainer.getUserByUPN(user.tenantId, user.upn ?? '');
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
        await userContainer.updateUser({
          ...existingUser,
          last_login: currentTime,
          groups: userGroups,
        }, user.tenantId, user.userId);
      }

      return true;
    } catch (error) {
      console.error("Error handling sign-in:", error);
      return false;
    }
  }
};