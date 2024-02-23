import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";

class UnauthorizedGroupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedGroupError";
  }
}

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

      if (process.env.NODE_ENV === 'development') {
        return true;
      }

      let tenant = await tenantContainerExtended.getTenantById(user.tenantId);
      if (!tenant) {
        if (userGroups.length > 0) {
          const accessGroups = process.env.ACCESS_GROUPS ? process.env.ACCESS_GROUPS.split(',') : [];
          const isUserGroupApproved = userGroups.some(userGroup => accessGroups.includes(userGroup));
          if (!isUserGroupApproved) {
            throw new UnauthorizedGroupError("User does not belong to any authorised groups.");
          }
        }
      } else if (tenant.requiresGroupLogin) {
        if (userGroups.length === 0) {
          throw new UnauthorizedGroupError("User must belong to at least one group for this tenant.");
        }

        const groupsApproved = await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString || "");
        if (!groupsApproved) {
          throw new UnauthorizedGroupError("User's groups are not authorized for this tenant.");
        }
      }

      return true;
    } catch (error) {
      console.error("Error during sign-in process:", error);
      return false;
    }
  }
};
