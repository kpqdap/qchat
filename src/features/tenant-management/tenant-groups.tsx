import { CosmosDBTenantContainer } from "./tenant-cosmos"

export class CosmosDBTenantContainerExtended extends CosmosDBTenantContainer {
  public async areGroupsPresentForTenant(tenantId: string, groupsString: string): Promise<boolean> {
    try {
      const tenant = await this.getTenantById(tenantId)
      if (!tenant || !tenant.groups) {
        return false;
      }

      const groupsToCheck = groupsString.split(",").map(group => group.trim())
      return groupsToCheck.some(group => (tenant.groups ?? []).includes(group))
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}