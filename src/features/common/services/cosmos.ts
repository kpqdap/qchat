import { Container, CosmosClient, Database, PartitionKeyDefinitionVersion, PartitionKeyKind } from "@azure/cosmos"
import { handleCosmosError } from "../cosmos-error"
import { AI_NAME } from "@/features/theme/theme-config"

const DB_NAME = process.env.AZURE_COSMOSDB_DB_NAME || AI_NAME
const ENDPOINT = process.env.AZURE_COSMOSDB_URI
const KEY = process.env.AZURE_COSMOSDB_KEY
const SEARCH_API_KEY = process.env.AZURE_SEARCH_API_KEY

class CosmosDB {
  private static client: CosmosClient
  private static database: Database

  private static initClient(): void {
    if (!this.client) {
      this.client = new CosmosClient({
        endpoint: ENDPOINT,
        key: KEY,
        defaultHeaders: {
          "api-key": SEARCH_API_KEY,
        },
      })
      this.database = this.client.database(DB_NAME)
    }
  }

  public static async getContainer(
    containerName: string,
    partitionKeyPaths: string[] = ["/tenantId", "/userId"]
  ): Promise<Container> {
    this.initClient()

    try {
      const partitionKey = {
        paths: partitionKeyPaths,
        kind: PartitionKeyKind.MultiHash,
        version: PartitionKeyDefinitionVersion.V2,
      }

      const { container } = await this.database.containers.createIfNotExists({
        id: containerName,
        partitionKey,
      })

      return container
    } catch (error) {
      handleCosmosError(error as Error & { code?: number })
      throw error
    }
  }
}

const initContainers = async (): Promise<void> => {
  const HistoryContainer = await CosmosDB.getContainer("history")
  const UsersContainer = await CosmosDB.getContainer("users")
  const TenantsContainer = await CosmosDB.getContainer("tenants", ["/tenantId"])
  const ConfigContainer = await CosmosDB.getContainer("config")
}
