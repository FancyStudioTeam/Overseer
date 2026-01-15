import 'server-only';

import { env } from '#/utils/functions/env.ts';

export const CLIENT_ID = env('CLIENT_ID');
export const CLIENT_SECRET = env('CLIENT_SECRET');

export const MONGO_DB_CONNECTION_URL = env('MONGO_DB_CONNECTION_URL');
