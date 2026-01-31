import { cookies as NextCookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { logger } from '#/lib/Logger.ts';
import { createRedirectUrl } from '#/utils/createRedirectUrl.ts';
import { getErrorMessage } from '#/utils/getErrorMessage.ts';
import { SOMETHING_WENT_WRONG_ERROR_RESPONSE } from './_lib/Responses.ts';
import { createAuthState } from './_utils/createAuthState.ts';

export async function GET() {
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
		logger.error(getErrorMessage(error));

		return SOMETHING_WENT_WRONG_ERROR_RESPONSE();
	}
}
