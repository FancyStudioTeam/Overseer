import 'server-only';

import type { Snowflake } from 'discord-api-types/globals';
import { jwtVerify, SignJWT } from 'jose';
import { AUTH_SECRET } from './Constants.ts';

const TEXT_ENCODER = new TextEncoder();
const TEXT_ENCODER_SECRET = TEXT_ENCODER.encode(AUTH_SECRET);

export const Jose = {
	async sign(sessionId: string, subjectId: Snowflake): Promise<string> {
		const jsonWebToken = new SignJWT({
			sid: sessionId,
		});

		jsonWebToken.setProtectedHeader({
			alg: 'HS256',
			typ: 'JWT',
		});

		jsonWebToken.setAudience('https://getvanguard.xyz/api');

		jsonWebToken.setIssuer('https://getvanguard.xyz/api');
		jsonWebToken.setIssuedAt();

		jsonWebToken.setSubject(subjectId);

		jsonWebToken.setExpirationTime('7d');

		const signedJsonWebToken = await jsonWebToken.sign(TEXT_ENCODER_SECRET);

		return signedJsonWebToken;
	},

	async verify(jsonWebToken: string): Promise<string | null> {
		try {
			const { payload } = await jwtVerify(jsonWebToken, TEXT_ENCODER_SECRET, {
				audience: 'https://getvanguard.xyz/api',
				issuer: 'https://getvanguard.xyz',
			});

			const { sid } = payload;

			return String(sid);
		} catch {
			return null;
		}
	},
} as const;
