import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	css: [
		'./app/assets/css/fonts.css',
		'./app/assets/css/tailwind.css',
	],
	devtools: {
		enabled: true,
	},
	runtimeConfig: {
		clientId: '', // NUXT_CLIENT_ID
		clientSecret: '', // NUXT_CLIENT_SECRET
		clientToken: '', // NUXT_CLIENT_TOKEN
		encryptionKey: '', // NUXT_ENCRYPTION_KEY
		mongoDbCollectionName: '', // NUXT_MONGO_DB_COLLECTION_NAME
		mongoDbConnectionUrl: '', // NUXT_MONGO_DB_CONNECTION_URL
		mongoDbDatabaseName: '', // NUXT_MONGO_DB_DATABASE_NAME
		public: {
			baseUrl: 'http://localhost:3000', // NUXT_PUBLIC_BASE_URL,
		},
		sessionKey: '', // NUXT_SESSION_KEY
	},
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
});
