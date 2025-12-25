import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	css: [
		"./app/assets/css/fonts.css",
		"./app/assets/css/tailwind.css",
	],
	devtools: {
		enabled: true,
	},
	runtimeConfig: {
		authSecret: "", // NUXT_AUTH_SECRET
		clientId: "", // NUXT_CLIENT_ID
		clientSecret: "", // NUXT_CLIENT_SECRET
		clientToken: "", // NUXT_CLIENT_TOKEN
		encryptionKey: "", // NUXT_ENCRYPTION_KEY
		jwtSecret: "", // NUXT_JWT_SECRET
		public: {
			baseUrl: "http://localhost:3000", // NUXT_PUBLIC_BASE_URL,
		},
	},
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
});
