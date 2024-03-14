import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos"
import { CosmosDBTenantContainerExtended } from "../tenant-management/tenant-groups"
import { CosmosDBTenantContainer, TenantRecord } from "../tenant-management/tenant-cosmos"

interface GraphResponse {
  value: { id: string }[]
}

async function callGraphApi(accessToken: string, endpoint: string): Promise<GraphResponse> {
  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  })
  const response = await fetch(endpoint, { headers })
  if (!response.ok) {
    throw new Error(`Failed to fetch from Microsoft Graph API: ${response.statusText}`)
  }
  return response.json() as Promise<GraphResponse>
}

export class UserSignInHandler {
  static async handleSignIn(user: UserRecord, accessToken: string): Promise<boolean> {
    const userContainer = new CosmosDBUserContainer()
    const tenantContainerExtended = new CosmosDBTenantContainerExtended()
    const tenantContainer = new CosmosDBTenantContainer()

    try {
      const groupAdmins = process.env.ADMIN_EMAIL_ADDRESS?.split(",").map(email => email.trim().toLowerCase()) || []
      const tenant = await tenantContainerExtended.getTenantById(user.tenantId)

      if (!tenant) {
        const tenantRecord: TenantRecord = createTenantRecord(user, groupAdmins)
        await tenantContainer.createTenant(tenantRecord)
      } else {
        if (tenant.requiresGroupLogin && !(await isUserInRequiredGroups(accessToken, tenant.groups || []))) {
          await updateFailedLogin(user)
          return false
        }

        const existingUser = await userContainer.getUserByUPN(user.tenantId, user.upn)
        if (!existingUser) {
          await createUser(userContainer, user)
        } else {
          await updateUser(userContainer, existingUser, user)
        }
      }

      return true
    } catch (error) {
      console.error("Error handling sign-in:", error)
      return false
    }
  }
}

async function isUserInRequiredGroups(accessToken: string, requiredGroups: string[] = []): Promise<boolean> {
  if (!requiredGroups.length) return true

  const graphResponse = await callGraphApi(accessToken, "https://graph.microsoft.com/v1.0/me/memberOf?$select=id")
  const userGroups = graphResponse.value.map(group => group.id)

  return requiredGroups.some(groupId => userGroups.includes(groupId))
}

function createTenantRecord(user: UserRecord, groupAdmins: string[]): TenantRecord {
  const domain = user.upn?.split("@")[1] || ""
  return {
    tenantId: user.tenantId,
    primaryDomain: domain,
    requiresGroupLogin: true,
    id: user.tenantId,
    email: user.upn,
    supportEmail: `support@${domain}`,
    dateCreated: new Date(),
    createdBy: user.upn,
    administrators: groupAdmins,
    dateUpdated: null,
    dateOnBoarded: null,
    dateOffBoarded: null,
    modifiedBy: null,
    departmentName: null,
    groups: [],
    features: null,
    serviceTier: null,
  }
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
  existingUser: UserRecord,
  user: UserRecord,
  userGroups?: string[]
): Promise<void> {
  try {
    const currentTime = new Date()
    await userContainer.updateUser(
      {
        ...existingUser,
        last_login: currentTime,
        groups: userGroups,
      },
      user.tenantId,
      user.userId
    )
  } catch (error) {
    console.error("Error updating user:", error)
  }
}

// Update failed login
function updateFailedLogin(existingUser: UserRecord): UserRecord {
  try {
    existingUser.failed_login_attempts++
    existingUser.last_failed_login = new Date()
    return existingUser
  } catch (_e) {
    return existingUser
  }
}
