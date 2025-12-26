const {
	clientId,
	clientSecret,
	clientToken,
	encryptionKey,
	mongoDbCollectionName,
	mongoDbConnectionUrl,
	mongoDbDatabaseName,
	public: _public,
	sessionKey,
} = useRuntimeConfig();
const { baseUrl } = _public;

export const BASE_URL = baseUrl;

export const CLIENT_ID = clientId;
export const CLIENT_SECRET = clientSecret;
export const CLIENT_TOKEN = clientToken;

export const ENCRYPTION_KEY = encryptionKey;

export const MONGO_DB_COLLECTION_NAME = mongoDbCollectionName;
export const MONGO_DB_CONNECTION_URL = mongoDbConnectionUrl;
export const MONGO_DB_DATABASE_NAME = mongoDbDatabaseName;

export const SESSION_KEY = sessionKey;
