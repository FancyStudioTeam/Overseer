import 'server-only';

import type { Snowflake } from 'discord-api-types/globals';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { Jose } from '#/lib/Jose.ts';

export async function createJsonWebToken(
	sessionId: string,
	userId: Snowflake,
	nextCookies: ReadonlyRequestCookies,
	expiresIn: number,
): Promise<void> {
	const jsonWebToken = await Jose.sign(sessionId, userId);

	nextCookies.set('session', jsonWebToken, {
		httpOnly: true,
		maxAge: expiresIn,
		path: '/',
		sameSite: 'lax',
		secure: true,
	});
}
