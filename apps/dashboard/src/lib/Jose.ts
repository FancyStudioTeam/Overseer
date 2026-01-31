import 'server-only';

import type { Snowflake } from 'discord-api-types/globals';
import { jwtVerify, SignJWT } from 'jose';
import { AUTH_SECRET } from './Constants.ts';

const TEXT_ENCODER = new TextEncoder();
const TEXT_ENCODER_SECRET = TEXT_ENCODER.encode(AUTH_SECRET);

export const Jose = {
	/**
	 * Signs a JSON Web Token with the provided session and subject ID.
	 *
	 * @param sessionId - The session ID related to the new JSON Web Token.
	 * @param subjectId - The subject ID related to the new JSON Web Token.
	 */
	async sign(sessionId: string, subjectId: Snowflake): Promise<string> {
		const jsonWebToken = new SignJWT({
			sid: sessionId,
		});

		jsonWebToken.setProtectedHeader({
			alg: 'HS256',
			typ: 'JWT',
		});

		jsonWebToken.setAudience('https://getvanguard.xyz/api');

		jsonWebToken.setIssuer('https://getvanguard.xyz');
		jsonWebToken.setIssuedAt();

		jsonWebToken.setSubject(subjectId);

		jsonWebToken.setExpirationTime('7d');

		const signedJsonWebToken = await jsonWebToken.sign(TEXT_ENCODER_SECRET);

		return signedJsonWebToken;
	},

	/**
	 * Verifies a JSON Web Token.
	 *
	 * @param jsonWebToken - The JSON Web Token to verify.
	 */
	async verify(jsonWebToken: string): Promise<string | null> {
		try {
			const { payload } = await jwtVerify(
				jsonWebToken,
				TEXT_ENCODER_SECRET,
				{
					audience: 'https://getvanguard.xyz/api',
					issuer: 'https://getvanguard.xyz',
				},
			);

			const { sid } = payload;

			return String(sid);
		} catch {
			return null;
		}
	},
} as const;
