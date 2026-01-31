import { cookies as NextCookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { logger } from '#/lib/Logger.ts';
import { createRedirectUrl } from '#/utils/createRedirectUrl.ts';
import { INTERNAL_SERVER_ERROR_RESPONSE } from './_lib/Responses.ts';
import { createAuthState } from './_utils/createAuthState.ts';

export async function GET(nextRequest: NextRequest) {
	try {
		const nextCookies = await NextCookies();

		/*
		 * Create an authorization state to check later whether the user was
		 * clickjacked.
		 *
		 * Rerefence: https://discord.com/developers/docs/topics/oauth2#state-and-security
		 */
		const oauth2State = createAuthState(nextCookies);
		const redirectUrl = createRedirectUrl(oauth2State);

		return NextResponse.redirect(redirectUrl);
	} catch (error) {
		const { nextUrl } = nextRequest;
		const { href } = nextUrl;

		logger.error(`Error while processing route '${href}':\n\t`, error);

		return INTERNAL_SERVER_ERROR_RESPONSE();
	}
}
