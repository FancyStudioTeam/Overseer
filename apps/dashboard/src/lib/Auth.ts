import 'server-only';

import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { CLIENT_ID, CLIENT_SECRET, MONGO_DB_CONNECTION_URL } from './Constants.ts';

if (!MONGO_DB_CONNECTION_URL) {
	throw new TypeError(`Environment Variable 'MONGO_DB_CONNECTION_URL' is not set`);
}

if (!CLIENT_ID) {
	throw new TypeError(`Environment Variable 'CLIENT_ID' is not set`);
}

if (!CLIENT_SECRET) {
	throw new TypeError(`Environment Variable 'CLIENT_SECRET' is not set`);
}

const client = new MongoClient(MONGO_DB_CONNECTION_URL);
const db = client.db('sessions');

export const auth = betterAuth({
	// biome-ignore lint/style/useNamingConvention: (x)
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
	database: mongodbAdapter(db, {
		client,
	}),
	socialProviders: {
		discord: {
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
		},
	},
});
