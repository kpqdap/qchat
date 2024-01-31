import { Container, CosmosClient, Database, PartitionKeyDefinitionVersion, PartitionKeyKind } from "@azure/cosmos";
import { randomBytes, createHash } from 'crypto';
import { getTenantId } from "../auth/helpers";

const DB_NAME = process.env.AZURE_COSMOSDB_DB_NAME || "localdev";
const CONTAINER_NAME = process.env.AZURE_COSMOSDB_USERS_CONTAINER_NAME || "users";

export class CosmosDBUserContainer {
  private client: CosmosClient;
  private databaseId!: string;
  private container: Promise<Container>;

  constructor() {
    this.client = new CosmosClient({
      endpoint: process.env.AZURE_COSMOSDB_URI,
      key: process.env.AZURE_COSMOSDB_KEY,
    });
    this.initDatabaseId();
    this.container = this.initDBContainer();
  }

  private async initDatabaseId() {
    this.databaseId = DB_NAME;
  }

  public async createDatabaseIfNotExists(): Promise<Database> {
    const databaseResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId,
    });
    return databaseResponse.database;
  }

  private async initDBContainer(): Promise<Container> {
    await this.createDatabaseIfNotExists();
    const database = this.client.database(this.databaseId);
    const containerResponse = await database.containers.createIfNotExists({
      id: CONTAINER_NAME,
      partitionKey: {
        paths: ["/tenantId", "/userId"],
        kind: PartitionKeyKind.MultiHash,
        version: PartitionKeyDefinitionVersion.V2,
      },
    });
    return containerResponse.container;
  }

  public async getContainer(): Promise<Container> {
    return await this.container;
  }

  public async createUser(user: UserRecord): Promise<void> {
    const container = await this.getContainer();
    const salt = this.generateSalt();
    const hashedUserId = this.hashValueWithSalt(user.upn ?? '', salt);
    
    await container.items.create({
      ...user,
      id: hashedUserId,
      userId: hashedUserId,
      salt: salt,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      upn: user.upn,
      last_login: new Date().toISOString(),
      first_login: new Date().toISOString(),
      accepted_terms: false,
      accepted_terms_date: "",
    });
  }

  public async getUserByUPN(upn: string): Promise<UserRecord | undefined> {
    try {
      const container = await this.getContainer();
      const query = {
        query: "SELECT * FROM c WHERE c.upn = @upn",
        parameters: [{ name: "@upn", value: upn }],
      };
      const { resources } = await container.items.query<UserRecord>(query).fetchAll();
      return resources[0];
    } catch (e) {
      console.error("Error retrieving user by UPN:", e);
      return undefined;
    }
  }

  private hashValueWithSalt(value: string, salt: string): string {
    return createHash('sha256').update(salt + value).digest('hex');
  }

  private generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  public async updateUser(user: UserRecord): Promise<void> {
    try {
      const container = await this.getContainer();
      if (!user.userId) {
        throw new Error("User must have a userId to be updated.");
      }

      const { resource: existingUser } = await container.item(user.userId, user.userId).read<UserRecord>();
      const updatedUser = {
        ...existingUser,
        ...user,
      };
      await container.items.upsert(updatedUser);
    } catch (e) {
      console.error("Error updating user:", e);
    }
  }
}


export type UserRecord = {
  id: string;
  email: string | null | undefined;
  upn: string | null | undefined;
  name: string | null | undefined;
  userId?: string | null | undefined;
  salt?: string;
  tenantId?: string | null | undefined;
  last_login?: string | null | undefined;
  first_login?: string | null | undefined;
  accepted_terms?: boolean | null | undefined;
  accepted_terms_date?: string | null | undefined;
};

async function userSetup() {
  const container = new CosmosDBUserContainer();

  const userRecord: UserRecord = {
    id: "user-123",
    email: "user@qld.gov.au",
    upn: "user@qld.gov.au",
    name: "First Last",
    userId: "user-123",
    tenantId: "localdev",
    last_login: new Date().toISOString(),
    first_login: new Date().toISOString(),
    accepted_terms: false,
    accepted_terms_date: "",

  };
  await container.createUser(userRecord);
}

userSetup();
