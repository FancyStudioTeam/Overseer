import 'server-only';

import type { Snowflake } from 'discord-api-types/globals';
import { MongoClient } from 'mongodb';
import {
	MONGO_DB_COLLECTION_NAME,
	MONGO_DB_CONNECTION_URL,
	MONGO_DB_DATABASE_NAME,
} from '#/lib/Constants.ts';

export const client = new MongoClient(MONGO_DB_CONNECTION_URL);
export const db = client.db(MONGO_DB_DATABASE_NAME);

export const collection = db.collection<SessionDocument>(MONGO_DB_COLLECTION_NAME);

export interface SessionDocument {
	credentials: SessionDocumentCredentials;
	session_id: string;
	user: SessionDocumentUser;
}

export interface SessionDocumentCredentials {
	access_token: string;
	refesh_token: string;
}

export interface SessionDocumentUser {
	avatar: string | null;
	email?: string | null;
	id: Snowflake;
	name: string;
}
