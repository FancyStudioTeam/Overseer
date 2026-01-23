import 'server-only';

import { createHash } from 'node:crypto';
import { env } from 'node:process';

export const {
	AUTH_SECRET = 'youshallnopass',
	CLIENT_ID = '1234567890987654321',
	CLIENT_SECRET = 'youshallnopass',
	ENCRYPTION_KEY = 'youshallnopass',
	MONGO_DB_CONNECTION_URL = 'mongodb://localhost:27017',
	MONGO_DB_DATABASE_NAME = 'sessions',
} = env;

export const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
export const ENCRYPTION_HASH = createHash('sha256');
export const ENCRYPTION_IV_LENGTH = 12;
export const ENCRYPTION_SECRET = ENCRYPTION_HASH.update(ENCRYPTION_KEY).digest();
export const ENCRYPTION_TAG_LENGTH = 16;
