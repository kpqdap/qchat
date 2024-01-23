import { CosmosClient } from "@azure/cosmos";

const DB_NAME = process.env.AZURE_COSMOSDB_DB_NAME || "chat";
const USER_PREFS_CONTAINER_NAME = process.env.AZURE_COSMOSDB_USER_PREFS_CONTAINER_NAME || "userPreferences";

export const initUserPrefsContainer = async () => {
  const endpoint = process.env.AZURE_COSMOSDB_URI;
  const key = process.env.AZURE_COSMOSDB_KEY;

  const client = new CosmosClient({ endpoint, key });

  const databaseResponse = await client.databases.createIfNotExists({
    id: DB_NAME,
  });

  const containerResponse =
    await databaseResponse.database.containers.createIfNotExists({
      id: USER_PREFS_CONTAINER_NAME,
      partitionKey: {
        paths: ["/userId"],
      },
    });

  return containerResponse.container;
};
