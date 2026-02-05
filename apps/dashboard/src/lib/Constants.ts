import 'server-only';
import { env } from 'node:process';

export const {
	AUTH_SECRET = 'youshallnopass',
	BASE_URL = 'http://localhost:3000',
	CLIENT_ID = '1234567890987654321',
	CLIENT_SECRET = 'youshallnopass',
	CLIENT_TOKEN = 'xxxxxxxxxx.xxxxxxxxxx.xxxxxxxxxx',
	ENCRYPTION_KEY = 'youshallnopass',
	MONGO_DB_COLLECTION_NAME = 'sessions',
	MONGO_DB_CONNECTION_URL = 'mongodb://localhost:27017',
	MONGO_DB_DATABASE_NAME = 'sessions',
} = env;
