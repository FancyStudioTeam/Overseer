import 'server-only';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { encrypt } from '#/utils/functions/encrypt.ts';
import { CLIENT_ID, CLIENT_SECRET, MONGO_DB_CONNECTION_URL } from '../utils/Constants.ts';

const client = new MongoClient(MONGO_DB_CONNECTION_URL);
const db = client.db('better-auth');

export const auth = betterAuth({
	// biome-ignore lint/style/useNamingConvention: (x)
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
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
	socialProviders: {
		discord: {
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
		},
	},
});
