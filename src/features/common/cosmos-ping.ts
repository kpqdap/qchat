import { CosmosClient } from "@azure/cosmos"

const key = process.env.AZURE_COSMOSDB_KEY
const endpoint = process.env.AZURE_COSMOSDB_URI
const defaultHeaders = { "api-key": process.env.AZURE_SEARCH_API_KEY }

async function testCosmosDBConnection(): Promise<boolean> {
  try {
    const client = new CosmosClient({ endpoint, key, defaultHeaders })
    await client.databases.readAll().fetchAll()
    return true
  } catch (_error) {
    return false
  }
}

export { testCosmosDBConnection }
