import { Container, CosmosClient, PartitionKeyDefinitionVersion, PartitionKeyKind } from "@azure/cosmos"
import { handleCosmosError } from "./cosmos-error"

const DB_NAME = process.env.AZURE_COSMOSDB_DB_NAME || "localdev"
const CONTAINER_NAME = process.env.AZURE_COSMOSDB_CONTAINER_NAME || "history"

export const initDBContainer = async (): Promise<Container> => {
  try {
    const endpoint = process.env.AZURE_COSMOSDB_URI
    const key = process.env.AZURE_COSMOSDB_KEY
    const defaultHeaders = { "api-key": process.env.AZURE_SEARCH_API_KEY }

    const client = new CosmosClient({ endpoint, key, defaultHeaders })

    const databaseResponse = await client.databases.createIfNotExists({
      id: DB_NAME,
    })

    const containerResponse = await databaseResponse.database.containers.createIfNotExists({
      id: CONTAINER_NAME,
      partitionKey: {
        paths: ["/tenantId", "/userId"],
        kind: PartitionKeyKind.MultiHash,
        version: PartitionKeyDefinitionVersion.V2,
      },
    })

    return containerResponse.container
  } catch (error) {
    handleCosmosError(error as Error & { code?: number })
    throw error
  }
}

export class CosmosDBContainer {
  private static instance: CosmosDBContainer
  private container: Promise<Container>

  private constructor() {
    this.container = (async (): Promise<Container> => {
      try {
        const endpoint = process.env.AZURE_COSMOSDB_URI
        const key = process.env.AZURE_COSMOSDB_KEY
        const defaultHeaders = { "api-key": process.env.AZURE_SEARCH_API_KEY }

        const client = new CosmosClient({ endpoint, key, defaultHeaders })

        const databaseResponse = await client.databases.createIfNotExists({
          id: DB_NAME,
        })

        const containerResponse = await databaseResponse.database.containers.createIfNotExists({
          id: CONTAINER_NAME,
          partitionKey: {
            paths: ["/tenantId", "/userId"],
            kind: PartitionKeyKind.MultiHash,
            version: PartitionKeyDefinitionVersion.V2,
          },
        })

        return containerResponse.container
      } catch (error) {
        handleCosmosError(error as Error & { code?: number })
        throw error
      }
    })()
  }

  public static getInstance(): CosmosDBContainer {
    if (!CosmosDBContainer.instance) {
      CosmosDBContainer.instance = new CosmosDBContainer()
    }

    return CosmosDBContainer.instance
  }

  public async getContainer(): Promise<Container> {
    return this.container
  }
}
