import { testCosmosDBConnection } from "../common/cosmos-ping";
import { CosmosDBUserContainer, UserRecord } from "../user-management/user-cosmos";

export class UserSignInHandler {
    static async handleSignIn(user: UserRecord) {
        const connectionTestResult = await testCosmosDBConnection();

        if (!connectionTestResult) {
            console.error("Cosmos DB connection failed, aborting user sign-in.");
            throw new Error("Unable to connect to Cosmos DB.");
        }
        const container = new CosmosDBUserContainer();

        try {
        const existingUser = await container.getUserByUPN(user.upn ?? '');
        if (!existingUser) {
            await container.createUser({
                ...user,
                first_login: new Date().toISOString(),
                accepted_terms: false,
                accepted_terms_date: "",
            });
        } else {
            const currentTime = new Date();
            await container.updateUser({
                ...existingUser,
                last_login: currentTime.toISOString(),
            });
        }
        } catch (error) {
        console.error("Error handling user sign-in:", error);
        throw new Error("Failed to handle user sign-in");
        }
    }
}
