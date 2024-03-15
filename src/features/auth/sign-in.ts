import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos"
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups"
import { CosmosDBTenantContainer, TenantRecord } from "../tenant-management/tenant-cosmos"
import { User } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { hashValue } from "./helpers"

async function callGraphApi(accessToken: string, endpoint: string): Promise<string[]> {
  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  })
  const response = await fetch(endpoint, { headers })
  if (!response.ok) {
    throw new Error(`Failed to fetch from Microsoft Graph API: ${response.statusText}`)
  }
  const result = await response.json()
  return result.value?.map((group: { id: string }) => group.id) || []
}

export class UserSignInHandler {
  static async handleSignIn(user: User | AdapterUser, accessToken: string): Promise<boolean> {
    const userContainer = new CosmosDBUserContainer()
    const tenantContainerExtended = new CosmosDBTenantContainerExtended()
    const tenantContainer = new CosmosDBTenantContainer()
    try {
      const tenant = await tenantContainerExtended.getTenantById(user.tenantId)

      let existingUser = await userContainer.getUserByUPN(user.tenantId, user.upn)
      if (!existingUser) {
        existingUser = await createUser(userContainer, createUserRecord(user))
      }

      if (!tenant) {
        const groupAdmins = process.env.ADMIN_EMAIL_ADDRESS?.split(",").map(email => email.trim().toLowerCase()) || []
        const tenantRecord: TenantRecord = createTenantRecord(existingUser, groupAdmins)
        await tenantContainer.createTenant(tenantRecord)

        await updateUser(userContainer, existingUser, [], false)
        return false
      }
      if (!tenant.requiresGroupLogin) {
        return true
      }

      const userGroups = await callGraphApi(accessToken, "https://graph.microsoft.com/v1.0/me/memberOf?$select=id")

      if (tenant.requiresGroupLogin && (await isUserInRequiredGroups(userGroups, tenant.groups || []))) {
        await updateUser(userContainer, existingUser, userGroups, true)
        return true
      }

      await updateUser(userContainer, existingUser, userGroups, false)
      return false
    } catch (error) {
      console.error("Error handling sign-in:", error)
      return false
    }
  }
}

async function isUserInRequiredGroups(userGroups: string[], requiredGroups: string[] = []): Promise<boolean> {
  if (!requiredGroups.length) return false

  const outcome = requiredGroups.some(groupId => userGroups.includes(groupId))
  return outcome
}

function createTenantRecord(user: UserRecord, groupAdmins: string[]): TenantRecord {
  const domain = user.upn?.split("@")[1] || ""
  const currentTime = new Date()
  return {
    tenantId: user.tenantId,
    primaryDomain: domain,
    requiresGroupLogin: true,
    id: user.tenantId,
    email: user.upn,
    supportEmail: `support@${domain}`,
    dateCreated: currentTime,
    createdBy: user.upn,
    administrators: groupAdmins,
    dateUpdated: currentTime,
    dateOnBoarded: null,
    dateOffBoarded: null,
    modifiedBy: null,
    departmentName: null,
    groups: [],
    features: null,
    serviceTier: null,
    history: [`${currentTime}: Tenant created by user ${user.upn} on failed login.`],
  }
}

function createUserRecord(user: User | AdapterUser) {
  const now = new Date()
  const userRecord: UserRecord = {
    id: hashValue(user.upn),
    tenantId: user.tenantId,
    email: user.email ?? user.upn,
    name: user.name ?? "",
    upn: user.upn,
    userId: user.upn,
    qchatAdmin: user.qchatAdmin ?? false,
    last_login: now,
    first_login: now,
    accepted_terms: true,
    accepted_terms_date: now.toISOString(),
    failed_login_attempts: 0,
    last_failed_login: null,
    history: [`${now}: User created.`],
  }
  return userRecord
}

async function createUser(
  userContainer: CosmosDBUserContainer,
  user: UserRecord,
  userGroups?: string[]
): Promise<UserRecord> {
  try {
    await userContainer.createUser({
      ...user,
      first_login: new Date(),
      accepted_terms: false,
      accepted_terms_date: "",
      groups: userGroups,
    })

    return user
  } catch (_e) {
    return user
  }
}

async function updateUser(
  userContainer: CosmosDBUserContainer,
  user: UserRecord,
  userGroups?: string[],
  loginSuccess?: boolean
): Promise<UserRecord> {
  try {
    const currentTime = new Date()

    if (loginSuccess === true) {
      user.failed_login_attempts = 0
      user.last_login = currentTime
    }
    if (loginSuccess === false) {
      user.failed_login_attempts++
      user.last_failed_login = currentTime
    }
    const updatedUser = {
      ...user,
      groups: userGroups,
    }
    await userContainer.updateUser(updatedUser, user.tenantId, user.userId)
    return updatedUser
  } catch (error) {
    console.error("Error updating user:", error)
    return user
  }
}
