import 'server-only';

import type { Snowflake } from 'discord-api-types/globals';
import type { APIUser } from 'discord-api-types/v10';
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';
import { AUTH_SECRET } from './Constants.ts';

const JSON_WEB_TOKEN_AUDIENCE =
	'https://vanguard.fancystudio.xyz/api/' as const;
const JSON_WEB_TOKEN_ISSUER = 'https://vanguard.fancystudio.xyz/' as const;

const TEXT_ENCODER = new TextEncoder();
const TEXT_ENCODER_SECRET = TEXT_ENCODER.encode(AUTH_SECRET);

export class Jose {
	static async sign(
		sessionId: string,
		subjectId: Snowflake,
		user: APIUser,
	): Promise<string> {
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

		jsonWebToken.setAudience(JSON_WEB_TOKEN_AUDIENCE);

		jsonWebToken.setIssuer(JSON_WEB_TOKEN_ISSUER);
		jsonWebToken.setIssuedAt();

		jsonWebToken.setSubject(subjectId);

		jsonWebToken.setExpirationTime('1d');

		const signedJsonWebToken = await jsonWebToken.sign(TEXT_ENCODER_SECRET);

		return signedJsonWebToken;
	}

	static async verify(
		jsonWebToken: string,
	): Promise<JsonWebTokenPayload | null> {
		try {
			const { payload } = await jwtVerify<JsonWebTokenPayload>(
				jsonWebToken,
				TEXT_ENCODER_SECRET,
				{
					algorithms: [
						'HS256',
					],
					audience: JSON_WEB_TOKEN_AUDIENCE,
					issuer: JSON_WEB_TOKEN_ISSUER,
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
