import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups";
import { CosmosDBTenantContainer, TenantRecord } from "../tenant-management/tenant-cosmos";

export class UserSignInHandler {
  static async handleSignIn(user: UserRecord, groupsString?: string): Promise<boolean> {
    const userContainer = new CosmosDBUserContainer();
    const tenantContainerExtended = new CosmosDBTenantContainerExtended();
    const tenantContainer = new CosmosDBTenantContainer();

    try {
      // Groups claim (Profile)
      const userGroups = groupsString ? groupsString.split(',').map(group => group.trim()) : []

      // Group Admins
      const groupAdmins = process.env.ADMIN_EMAIL_ADDRESS?.split(',').map(string => string.toLowerCase().trim());

      // Creates or updates the user
      let existingUser = await userContainer.getUserByUPN(user.tenantId, user.upn ?? '');
      if (!existingUser) {
        existingUser = await createUser(userContainer, user, userGroups);
      } else {
        await updateUser(userContainer, existingUser, user, userGroups);
      }

      // Validate if the tenant exists
      const tenant = await tenantContainerExtended.getTenantById(user.tenantId);
      if (!tenant) {
        //Create tenant with group login required
        const tenantRecord: TenantRecord = {
          tenantId: user.tenantId,
          primaryDomain: user.upn?.split('@')[1],
          requiresGroupLogin: true,
          id: user.tenantId,
          email: user.upn,
          supportEmail: "support@" + user.upn?.split('@')[1],
          dateCreated: new Date(),
          dateUpdated: null,
          dateOnBoarded: null,
          dateOffBoarded: null,
          modifiedBy: null,
          createdBy: user.upn,
          departmentName: null,
          groups: [],
          administrators: groupAdmins, //currently on groupAdmins, to be managed by tenant admins ()
          features: null,
          serviceTier: null,
        };

        await tenantContainer.createTenant(tenantRecord);

        // Update user as failed login
        await updateUser(userContainer, await updateFailedLogin(existingUser), user, userGroups);

        return false;
      }

      // Validate if the group is required and exists on tenant 
      if (tenant.requiresGroupLogin) {
        if (userGroups.length === 0 || !(await tenantContainerExtended.areGroupsPresentForTenant(user.tenantId, groupsString || ""))) {
          // Update user as failed login
          await updateUser(userContainer, await updateFailedLogin(existingUser), user, userGroups);

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

// Create New User
async function createUser(userContainer: CosmosDBUserContainer, user: UserRecord, userGroups: string[]): Promise<UserRecord> {
  try {
    await userContainer.createUser({
      ...user,
      first_login: new Date(),
      accepted_terms: false,
      accepted_terms_date: "",
      groups: userGroups,
    });

    return user;
  }
  catch (e) {
    console.log("Failed to create User.")
    return user;
  }
}

// Update existing user
async function updateUser(userContainer: CosmosDBUserContainer, existingUser: UserRecord, user: UserRecord, userGroups: string[]): Promise<void> {
  try {
    const currentTime = new Date();
    await userContainer.updateUser({
      ...existingUser,
      last_login: currentTime,
      groups: userGroups,
    }, user.tenantId, user.userId);
  }
  catch (e) {
    console.log("Failed to update User.")
  }
}

// Update failed login
async function updateFailedLogin(existingUser: UserRecord): Promise<UserRecord> {
  try {
    existingUser.failed_login_attempts++
    existingUser.last_failed_login = new Date();
    return existingUser;
  }
  catch (e) {
    console.log("Failed to update User Login")
    return existingUser;
  }
}