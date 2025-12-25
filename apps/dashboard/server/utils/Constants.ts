const {
	clientId,
	clientSecret,
	clientToken,
	public: { baseUrl },
} = useRuntimeConfig();

export const BASE_URL = baseUrl;

export const CLIENT_ID = clientId;
export const CLIENT_SECRET = clientSecret;
export const CLIENT_TOKEN = clientToken;
