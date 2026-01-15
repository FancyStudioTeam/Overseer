import type { Snowflake } from 'discord-api-types/globals';
import { MongoClient } from 'mongodb';

const client = new MongoClient(MONGO_DB_CONNECTION_URL);

export const db = client.db(MONGO_DB_DATABASE_NAME);
export const sessions = db.collection<SessionsCollection>(MONGO_DB_COLLECTION_NAME);

client
	.connect()
	.then(() => console.log('MongoDB is connected'))
	.catch((error) => console.error(error));

export interface SessionsCollection {
	access_token: string;
	refresh_token: string;
	user_id: Snowflake;
}
