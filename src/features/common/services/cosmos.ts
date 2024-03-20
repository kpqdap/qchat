import { Container, CosmosClient, PartitionKeyDefinitionVersion, PartitionKeyKind } from "@azure/cosmos"

let _cosmosClient: CosmosClient | null = null
const CosmosInstance = (): CosmosClient => {
  if (_cosmosClient) return _cosmosClient

  const endpoint = process.env.AZURE_COSMOSDB_URI
  const key = process.env.AZURE_COSMOSDB_KEY
  const defaultHeaders = { "api-key": process.env.AZURE_SEARCH_API_KEY }
  if (!endpoint || !key) throw new Error("Azure Cosmos DB is not configured. Please configure it in the .env file.")

  _cosmosClient = new CosmosClient({ endpoint, key, defaultHeaders })
  return _cosmosClient
}

let _historyContainer: Container | null = null
export const HistoryContainer = async (): Promise<Container> => {
  if (_historyContainer) return _historyContainer

  const dbName = process.env.AZURE_COSMOSDB_DB_NAME || "localdev"
  const containerName = process.env.AZURE_COSMOSDB_CHAT_CONTAINER_NAME || "history"

  const client = CosmosInstance()
  const { database } = await client.databases.createIfNotExists({ id: dbName })
  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: {
      paths: ["/tenantId", "/userId"],
      kind: PartitionKeyKind.MultiHash,
      version: PartitionKeyDefinitionVersion.V2,
    },
  })

  _historyContainer = container
  return _historyContainer
}

let _userContainer: Container | null = null
export const UserContainer = async (): Promise<Container> => {
  if (_userContainer) return _userContainer

  const dbName = process.env.AZURE_COSMOSDB_DB_NAME || "localdev"
  const containerName = process.env.AZURE_COSMOSDB_USER_CONTAINER_NAME || "users"

  const client = CosmosInstance()
  const { database } = await client.databases.createIfNotExists({ id: dbName })
  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: {
      paths: ["/tenantId", "/userId"],
      kind: PartitionKeyKind.MultiHash,
      version: PartitionKeyDefinitionVersion.V2,
    },
  })

  _userContainer = container
  return _userContainer
}

let _tenantContainer: Container | null = null
export const TenantContainer = async (): Promise<Container> => {
  if (_tenantContainer) return _tenantContainer

  const dbName = process.env.AZURE_COSMOSDB_DB_NAME || "localdev"
  const containerName = process.env.AZURE_COSMOSDB_TENANT_CONTAINER_NAME || "tenants"

  const client = CosmosInstance()
  const { database } = await client.databases.createIfNotExists({ id: dbName })
  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: {
      paths: ["/tenantId"],
      kind: PartitionKeyKind.MultiHash,
      version: PartitionKeyDefinitionVersion.V2,
    },
  })

  _tenantContainer = container
  return _tenantContainer
}
