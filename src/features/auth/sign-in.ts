import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";

export class UserSignInHandler {
    static async handleSignIn(user: UserRecord, groupsString: string) {
        const userContainer = new CosmosDBUserContainer();
        const tenantContainerExtended = new CosmosDBTenantContainerExtended();
      
        try {
          const existingUser = await userContainer.getUserByUPN(user.upn ?? '', user.tenantId);
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
      
          const tenant = await tenantContainerExtended.getTenantById(user.tenantId);
          if (!tenant) {
            throw new Error("Tenant does not exist.");
          }
      
          if (!tenant.requiresGroupLogin) {
            return;
          }
      
          const groupsApproved = await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString);
          if (!groupsApproved) {
            throw new Error("User's groups are not approved for the tenant.");
          }
        } catch (error) {
          console.error("Error handling user sign-in:", error);
          throw new Error("Failed to handle user sign-in");
        }
    }            
}