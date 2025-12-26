import { MongoClient } from 'mongodb';

export const mongo = new MongoClient(MONGO_DB_CONNECTION_URL, {
	maxPoolSize: 1,
});

async function connect(): Promise<void> {
	await mongo
		.connect()
		.then(() => console.log('MongoDB Client is connected'))
		.catch((error) => console.error(error));
}

connect();

export const db = mongo.db(MONGO_DB_DATABASE_NAME);
export const collection = db.collection(MONGO_DB_COLLECTION_NAME);
