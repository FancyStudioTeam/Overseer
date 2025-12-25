const { clientId, clientSecret, clientToken, encryptionKey, public: _public, sessionKey } = useRuntimeConfig();
const { baseUrl } = _public;

export const BASE_URL = baseUrl;

export const CLIENT_ID = clientId;
export const CLIENT_SECRET = clientSecret;
export const CLIENT_TOKEN = clientToken;

export const ENCRYPTION_KEY = encryptionKey;
export const SESSION_KEY = sessionKey;
