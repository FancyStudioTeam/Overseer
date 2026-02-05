import 'server-only';

import type { APIUser } from 'discord-api-types/v10';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { Jose } from '#/lib/Jose.ts';

export async function createJsonWebToken(
	nextCookies: ReadonlyRequestCookies,
	options: CreateJsonWebTokenOptions,
): Promise<void> {
	const { expiresIn, sessionId, user } = options;
	const { id: userId } = user;

	const jsonWebToken = await Jose.sign(sessionId, userId, user);

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
	user: APIUser;
}
