import 'server-only';

import type { Snowflake } from 'discord-api-types/globals';
import type { APIUser } from 'discord-api-types/v10';
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';
import { AUTH_SECRET } from './Constants.ts';

const TEXT_ENCODER = new TextEncoder();
const TEXT_ENCODER_SECRET = TEXT_ENCODER.encode(AUTH_SECRET);

export class Jose {
	static async sign(sessionId: string, subjectId: Snowflake, user: APIUser): Promise<string> {
		const { avatar, id, global_name, username } = user;

		const jsonWebToken = new SignJWT({
			sid: sessionId,
			user: {
				avatar,
				id,
				name: global_name ?? username,
			},
		});

		jsonWebToken.setProtectedHeader({
			alg: 'HS256',
			typ: 'JWT',
		});

		jsonWebToken.setAudience('https://vanguard.fancystudio.xyz/api');

		jsonWebToken.setIssuer('https://vanguard.fancystudio.xyz');
		jsonWebToken.setIssuedAt();

		jsonWebToken.setSubject(subjectId);

		jsonWebToken.setExpirationTime('7d');

		const signedJsonWebToken = await jsonWebToken.sign(TEXT_ENCODER_SECRET);

		return signedJsonWebToken;
	}

	static async verify(jsonWebToken: string): Promise<JsonWebTokenPayload | null> {
		try {
			const { payload } = await jwtVerify<JsonWebTokenPayload>(
				jsonWebToken,
				TEXT_ENCODER_SECRET,
				{
					algorithms: [
						'HS256',
					],
					audience: 'https://vanguard.fancystudio.xyz/api',
					issuer: 'https://vanguard.fancystudio.xyz',
				},
			);

			return payload;
		} catch {
			return null;
		}
	}
}

interface JsonWebTokenPayload extends JWTPayload {
	user: JsonWebTokenPayloadUser;
}

interface JsonWebTokenPayloadUser {
	avatar: string | null;
	id: Snowflake;
	name: string;
}
