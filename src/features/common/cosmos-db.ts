import { CosmosClient, Database, Container, PartitionKeyKind } from "@azure/cosmos";


const endpoint = process.env.AZURE_COSMOSDB_URI;
const key = process.env.AZURE_COSMOSDB_KEY;
const defaultHeaders = {'api-key': process.env.AZURE_SEARCH_API_KEY};

interface ExportedContainers {
  database: Database | null;
  usersContainer: Container | null;
  historyContainer: Container | null;
}

export const createDatabaseAndContainersIfNotExists = async (
  tenantId: string
): Promise<ExportedContainers> => {
  try {
    const client = new CosmosClient({ endpoint, key, defaultHeaders });
    console.log(`Creating or retrieving database for tenant '${tenantId}'...`);

    // Create or get the database based on the tenant ID
    const databaseId = `${tenantId}`;
    const databaseResponse = await client.databases.createIfNotExists({
      id: databaseId,
    });
    console.log(`Database '${databaseId}' created or retrieved successfully.`);
    const database = databaseResponse.database;

    // Create or get the 'Users' container
    const usersContainerId = "users";
    console.log(`Creating or retrieving 'Users' container...`);
    const usersContainerResponse = await database.containers.createIfNotExists({
      id: usersContainerId,
      partitionKey: {
        paths: ["/tenantId", "/userId"],
        kind: PartitionKeyKind.MultiHash,
        version: 2
      },
    });
    console.log(`'Users' container created or retrieved successfully.`);
    const usersContainer = usersContainerResponse.container;

    // Create or get the 'History' container
    const historyContainerId = "history";
    console.log(`Creating or retrieving 'History' container...`);
    const historyContainerResponse = await database.containers.createIfNotExists({
      id: historyContainerId,
      partitionKey: {
        paths: ["/tenantId", "/userId"],
        kind: PartitionKeyKind.MultiHash,
        version: 2
      },
    });
    console.log(`'History' container created or retrieved successfully.`);
    const historyContainer = historyContainerResponse.container;

    return {
      database,
      usersContainer,
      historyContainer,
    };
  } catch (error) {
    console.error(`Failed to create database and containers for tenant '${tenantId}':`, error);
    return {
      database: null,
      usersContainer: null,
      historyContainer: null,
    }; 
  }
};
