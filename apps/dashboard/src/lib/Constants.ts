import 'server-only';

import { scryptSync } from 'node:crypto';
import { env } from 'node:process';

export const {
	AUTH_SECRET = 'youshallnopass',
	BASE_URL = 'http://localhost:3000',
	CLIENT_ID = '1234567890987654321',
	CLIENT_SECRET = 'youshallnopass',
	ENCRYPTION_KEY = 'youshallnopass',
	MONGO_DB_COLLECTION_NAME = 'sessions',
	MONGO_DB_CONNECTION_URL = 'mongodb://localhost:27017',
	MONGO_DB_DATABASE_NAME = 'sessions',
} = env;

export const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
export const ENCRYPTION_ALGORITHM_KEY_LENGTH = 32;
export const ENCRYPTION_IV_LENGTH = 12;
export const ENCRYPTION_SECRET = scryptSync(
	ENCRYPTION_KEY,
	'salt',
	ENCRYPTION_ALGORITHM_KEY_LENGTH,
);
export const ENCRYPTION_TAG_LENGTH = 16;
