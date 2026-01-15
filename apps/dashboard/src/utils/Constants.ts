import 'server-only';
import { createHash } from 'node:crypto';
import { env } from '#/utils/functions/env.ts';

export const CLIENT_ID = env('CLIENT_ID');
export const CLIENT_SECRET = env('CLIENT_SECRET');

export const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
export const ENCRYPTION_HASH = createHash('sha256');
export const ENCRYPTION_IV_LENGTH = 12;
export const ENCRYPTION_KEY = ENCRYPTION_HASH.update(env('ENCRYPTION_KEY')).digest();
export const ENCRYPTION_TAG_LENGTH = 16;

export const MONGO_DB_CONNECTION_URL = env('MONGO_DB_CONNECTION_URL');
