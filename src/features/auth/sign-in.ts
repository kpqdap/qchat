import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";

export class UserSignInHandler {
  static async handleSignIn(user: UserRecord, groupsString: string) {
      const userContainer = new CosmosDBUserContainer();
      const tenantContainerExtended = new CosmosDBTenantContainerExtended();
    
      try {
        const existingUser = await userContainer.getUserByUPN(user.tenantId, user.upn ?? '');
        if (!existingUser) {
          console.log("Creating new user with UPN:", user.upn); // Log before creating
          await userContainer.createUser({
            ...user,
            first_login: new Date(),
            accepted_terms: false,
            accepted_terms_date: "",
            groups: groupsString.split(',').map(group => group.trim()),
          });
          console.log("User created successfully."); // Log after creating
        } else {
          console.log("Updating existing user with UPN:", user.upn); // Log before updating
          const currentTime = new Date();
          const updatedUser = {
            ...existingUser,
            last_login: currentTime,
            groups: groupsString.split(',').map(group => group.trim()),
          };
          
          await userContainer.updateUser(updatedUser);
          console.log("User updated successfully."); // Log after updating
        }
    
        const tenant = await tenantContainerExtended.getTenantById(user.tenantId);
        if (!tenant) {
          console.log("Tenant does not exist:", user.tenantId); // Log for non-existing tenant
          throw new Error("Tenant does not exist.");
        }
    
        if (!tenant.requiresGroupLogin) {
          console.log("Tenant does not require group login:", user.tenantId); // Log for tenant without group login requirement
          return;
        }
    
        const groupsApproved = await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString);
        if (!groupsApproved) {
          console.log("User's groups are not approved for the tenant:", user.tenantId); // Log for unapproved groups
          throw new Error("User's groups are not approved for the tenant.");
        }
      } catch (error) {
        console.error("Error handling user sign-in:", error);
        throw new Error("Failed to handle user sign-in");
      }
  }            
}
