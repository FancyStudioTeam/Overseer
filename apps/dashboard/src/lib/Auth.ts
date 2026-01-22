import 'server-only';

import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { encrypt } from '#/utils/functions/encrypt.ts';
import {
	AUTH_SECRET,
	CLIENT_ID,
	CLIENT_SECRET,
	MONGO_DB_CONNECTION_URL,
	MONGO_DB_DATABASE_NAME,
} from '../utils/Constants.ts';

const client = new MongoClient(MONGO_DB_CONNECTION_URL, {
	maxPoolSize: 5,
});
const db = client.db(MONGO_DB_DATABASE_NAME);

export const auth = betterAuth({
	/*
	 * biome-ignore lint/style/useNamingConvention: This naming convention comes
	 * from an external API and cannot be overridden.
	 */
	baseURL: getBaseUrl(),
	database: mongodbAdapter(db, {
		client,
	}),
	databaseHooks: {
		account: {
			create: {
				// @ts-expect-error
				before(account, _context) {
					const withEncryptedTokens = {
						...account,
					};
					const { accessToken, refreshToken } = account;

					if (accessToken) {
						withEncryptedTokens.accessToken = encrypt(accessToken);
					}

					if (refreshToken) {
						withEncryptedTokens.refreshToken = encrypt(refreshToken);
					}

					return {
						data: withEncryptedTokens,
					};
				},
			},
		},
		user: {
			create: {
				// @ts-expect-error
				before(user, _context) {
					const withEncryptedEmail = {
						...user,
					};
					const { email } = user;

					if (email) {
						withEncryptedEmail.email = encrypt(email);
					}

					return {
						data: withEncryptedEmail,
					};
				},
			},
		},
	},
	secret: AUTH_SECRET,
	socialProviders: {
		discord: {
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			disableDefaultScope: true,
			scope: [
				'guilds',
				'email',
				'identify',
			],
		},
	},
	trustedOrigins: [
		'https://getvanguard.xyz',
	],
});

function getBaseUrl(): string {
	const { env } = process;
	const { NODE_ENV } = env;

	return NODE_ENV === 'production' ? 'https://getvanguard.xyz' : 'http://localhost:3000';
}
