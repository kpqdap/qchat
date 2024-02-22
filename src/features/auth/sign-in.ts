import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";

class UnauthorizedGroupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedGroupError";
  }
}

export class UserSignInHandler {
  static async handleSignIn(user: UserRecord, groupsString: string) {
    const userContainer = new CosmosDBUserContainer();
    const tenantContainerExtended = new CosmosDBTenantContainerExtended();

    try {
      const existingUser = await userContainer.getUserByUPN(user.tenantId, user.upn ?? '');
      if (!existingUser) {
        await userContainer.createUser({
          ...user,
          first_login: new Date(),
          accepted_terms: false,
          accepted_terms_date: "",
          groups: groupsString.split(',').map(group => group.trim()),
        });
      } else {
        const currentTime = new Date();
        const updatedUser = {
          ...existingUser,
          last_login: currentTime,
          groups: groupsString.split(',').map(group => group.trim()),
        };

        await userContainer.updateUser(updatedUser);
      }

      let tenant = await tenantContainerExtended.getTenantById(user.tenantId);
      if (!tenant) {
        const accessGroups = process.env.ACCESS_GROUPS ? process.env.ACCESS_GROUPS.split(',') : [];
        const userGroups = groupsString.split(',').map(group => group.trim());

        const isUserGroupApproved = userGroups.some(userGroup => accessGroups.includes(userGroup));
        if (!isUserGroupApproved) {
          throw new UnauthorizedGroupError("User does not belong to any authorised groups.");
        }
      } else if (tenant.requiresGroupLogin) {
        const groupsApproved = await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString);
        if (!groupsApproved) {
          throw new UnauthorizedGroupError("User's groups are not authorized for this tenant.");
        }
      }
    } catch (error) {
      console.error("Error during sign-in process:", error);
      if (error instanceof UnauthorizedGroupError) {
        throw error;
      } else {
        throw new Error("An unexpected error occurred during the sign-in process.");
      }
    }
  }
}
