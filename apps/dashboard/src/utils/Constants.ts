import 'server-only';

import { createHash } from 'node:crypto';

export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;

export const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
export const ENCRYPTION_HASH = createHash('sha256');
export const ENCRYPTION_IV_LENGTH = 12;
export const ENCRYPTION_KEY = ENCRYPTION_HASH.update(process.env.ENCRYPTION_KEY ?? '').digest();
export const ENCRYPTION_TAG_LENGTH = 16;

export const MONGO_DB_CONNECTION_URL = process.env.MONGO_DB_CONNECTION_URL;
export const MONGO_DB_DATABASE_NAME = process.env.MONGO_DB_DATABASE_NAME;
