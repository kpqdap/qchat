import { CreateUser, GetUserByUpn, UpdateUser, type UserRecord } from "@/features/user-management/user-service"
import { CreateTenant, GetTenantById, type TenantRecord } from "@/features/tenant-management/tenant-service"
import { hashValue } from "./helpers"
import { User } from "next-auth"
import { AdapterUser } from "next-auth/adapters"

export class UserSignInHandler {
  static async handleSignIn(user: User | AdapterUser, userGroups: string[] = []): Promise<boolean> {
    try {
      // Group Admins
      const groupAdmins = process.env.ADMIN_EMAIL_ADDRESS?.split(",").map(string => string.toLowerCase().trim())
      const tenantResponse = await GetTenantById(user.tenantId)

      // Creates or updates the user
      const userRecord = await getsertUser(userGroups, user)

      // Validate if the tenant exists or create one
      if (tenantResponse.status === "ERROR" || tenantResponse.status === "UNAUTHORIZED") throw tenantResponse
      if (tenantResponse.status === "NOT_FOUND") {
        const now = new Date()
        const domain = user.upn?.split("@")[1] || ""
        const tenantRecord: TenantRecord = {
          tenantId: user.tenantId,
          primaryDomain: domain,
          requiresGroupLogin: true, // Create tenant with group login required
          id: user.tenantId,
          email: user.upn,
          supportEmail: `support@${domain}`,
          dateCreated: now.toISOString(),
          dateUpdated: now.toISOString(),
          dateOnBoarded: null,
          dateOffBoarded: null,
          modifiedBy: user.upn,
          createdBy: user.upn,
          departmentName: null,
          groups: [],
          administrators: groupAdmins,
          features: null,
          serviceTier: null,
          history: [`${now}: Tenant created by user ${user.upn} on failed login.`],
        }
        const tenant = await CreateTenant(tenantRecord)
        if (tenant.status !== "OK") throw tenant

        const userUpdate = {
          ...updateFailedLogin(userRecord),
          groups: [],
        }
        const updatedUser = await UpdateUser(user.tenantId, user.userId, userUpdate)
        if (updatedUser.status !== "OK") throw updatedUser

        return false
      }

      if (tenantResponse.status !== "OK") return false
      const tenant = tenantResponse.response

      if (!tenant.requiresGroupLogin || isUserInRequiredGroups(userGroups, tenant.groups || [])) {
        const userUpdate = {
          ...resetFailedLogin(userRecord),
          groups: userGroups,
        }
        const updatedUser = await UpdateUser(user.tenantId, user.userId, userUpdate)
        if (updatedUser.status !== "OK") throw updatedUser
        return true
      }

      const userUpdate = {
        ...updateFailedLogin(userRecord),
        groups: userGroups,
      }
      const updatedUser = await UpdateUser(user.tenantId, user.userId, userUpdate)
      if (updatedUser.status !== "OK") throw updatedUser
      return false
    } catch (error) {
      console.error("Error handling sign-in:", error)
      return false
    }
  }
}

const updateFailedLogin = (existingUser: UserRecord): UserRecord => ({
  ...existingUser,
  failed_login_attempts: existingUser.failed_login_attempts + 1,
  last_failed_login: new Date(),
})

const resetFailedLogin = (existingUser: UserRecord): UserRecord => ({
  ...existingUser,
  failed_login_attempts: 0,
  last_failed_login: new Date(),
})

const isUserInRequiredGroups = (userGroups: string[], requiredGroups: string[]): boolean =>
  !!requiredGroups.length && requiredGroups.some(groupId => userGroups.includes(groupId))

const getsertUser = async (userGroups: string[], user: User | AdapterUser): Promise<UserRecord> => {
  try {
    const now = new Date()
    const existingUserResponse = await GetUserByUpn(user.tenantId, user.upn ?? "")
    if (existingUserResponse.status === "NOT_FOUND") {
      const createUserResponse = await CreateUser({
        id: hashValue(user.upn),
        tenantId: user.tenantId,
        email: user.email ?? user.upn,
        name: user.name ?? "",
        upn: user.upn,
        userId: user.upn,
        qchatAdmin: user.qchatAdmin ?? false,
        last_login: now,
        first_login: now,
        accepted_terms: false,
        accepted_terms_date: "",
        groups: userGroups,
        failed_login_attempts: 0,
        last_failed_login: null,
        history: [`${now}: User created.`],
      })
      if (createUserResponse.status !== "OK") throw createUserResponse
      return createUserResponse.response
    }
    if (existingUserResponse.status !== "OK") throw existingUserResponse
    return existingUserResponse.response
  } catch (error) {
    console.error("Error upserting user:", error)
    throw error
  }
}
