import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";

class UnauthorizedGroupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedGroupError";
  }
}

export class UserSignInHandler {
  static async handleSignIn(user: UserRecord, groupsString?: string) {
    const userContainer = new CosmosDBUserContainer();
    const tenantContainerExtended = new CosmosDBTenantContainerExtended();

    console.log(`Starting handleSignIn for user: ${user.upn} in tenant: ${user.tenantId}`);

    try {
      const existingUser = await userContainer.getUserByUPN(user.tenantId, user.upn ?? '');
      console.log(`Existing user: ${existingUser ? "found" : "not found"}, proceeding with ${existingUser ? "update" : "creation"}.`);

      const userGroups = groupsString ? groupsString.split(',').map(group => group.trim()) : [];
      
      if (!existingUser) {
        await userContainer.createUser({
          ...user,
          first_login: new Date(),
          accepted_terms: false,
          accepted_terms_date: "",
          groups: userGroups,
        });
        console.log(`User created: ${user.upn}`);
      } else {
        const currentTime = new Date();
        const updatedUser = {
          ...existingUser,
          last_login: currentTime,
          groups: userGroups,
        };

        await userContainer.updateUser(updatedUser);
        console.log(`User updated: ${user.upn}`);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Skipping tenant and group checks.");
        return;
      }

      let tenant = await tenantContainerExtended.getTenantById(user.tenantId);
      if (!tenant) {
        console.log("No specific tenant found, checking against global access groups.");
        if (userGroups.length > 0) {
          const accessGroups = process.env.ACCESS_GROUPS ? process.env.ACCESS_GROUPS.split(',') : [];
          const isUserGroupApproved = userGroups.some(userGroup => accessGroups.includes(userGroup));
          if (!isUserGroupApproved) {
            throw new UnauthorizedGroupError("User does not belong to any authorised groups.");
          }
        }
      } else if (tenant.requiresGroupLogin) {
        console.log(`Tenant requires group login, checking user's groups for tenant: ${user.tenantId}`);
        if (userGroups.length === 0) {
          throw new UnauthorizedGroupError("User must belong to at least one group for this tenant.");
        }

        const groupsApproved = await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString || "");
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
