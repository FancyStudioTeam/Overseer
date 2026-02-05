import { cookies as NextCookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { Jose } from '#/lib/Jose.ts';
import { logger } from '#/lib/Logger.ts';
import { INTERNAL_SERVER_ERROR_RESPONSE } from '../sign-in/_lib/Responses.ts';
import { SESSION_RESPONSE, UNAUTHORIZED_RESPONSE } from './_lib/Responses.ts';

export async function GET(nextRequest: NextRequest) {
	try {
		const nextCookies = await NextCookies();
		const sessionCookie = nextCookies.get('session');

		if (!sessionCookie) {
			return UNAUTHORIZED_RESPONSE();
		}

		const { value } = sessionCookie;
		const jsonWebTokenPayload = await Jose.verify(value);

		if (!jsonWebTokenPayload) {
			return UNAUTHORIZED_RESPONSE();
		}

		const { user } = jsonWebTokenPayload;

		return SESSION_RESPONSE(user);
	} catch (error) {
		const { nextUrl } = nextRequest;
		const { href } = nextUrl;

		logger.error(`Error while processing route '${href}':\n\t`, error);

		return INTERNAL_SERVER_ERROR_RESPONSE();
	}
}
