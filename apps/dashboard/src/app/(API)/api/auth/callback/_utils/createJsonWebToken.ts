import 'server-only';

import type { Snowflake } from 'discord-api-types/globals';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { Jose } from '#/lib/Jose.ts';

export async function createJsonWebToken(
	nextCookies: ReadonlyRequestCookies,
	options: CreateJsonWebTokenOptions,
): Promise<void> {
	const { expiresIn, sessionId, userId } = options;
	const jsonWebToken = await Jose.sign(sessionId, userId);

	nextCookies.set('session', jsonWebToken, {
		httpOnly: true,
		maxAge: expiresIn,
		path: '/',
		sameSite: 'lax',
		secure: true,
	});
}

interface CreateJsonWebTokenOptions {
	expiresIn: number;
	sessionId: string;
	userId: Snowflake;
}
