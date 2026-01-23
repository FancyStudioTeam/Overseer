import { randomBytes } from 'node:crypto';
import { cookies as NextCookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { logger } from '#/lib/Logger.ts';
import { createRedirectUrl } from '#/utils/functions/createRedirectUrl.ts';
import { SOMETHING_WENT_WRONG_ERROR_RESPONSE } from './_lib/Responses.ts';

const OAUTH2_STATE_BYTES_LENGTH = 24;

export async function POST() {
	try {
		const cookies = await NextCookies();

		/*
		 * Create an authorization state to check later whether the user was
		 * clickjacked.
		 *
		 * Rerefence: https://discord.com/developers/docs/topics/oauth2#state-and-security
		 */
		const oauth2State = randomBytes(OAUTH2_STATE_BYTES_LENGTH);
		const oauth2StateString = oauth2State.toString('utf-8');

		cookies.set('oauth2_state', oauth2StateString);

		return NextResponse.redirect(createRedirectUrl(oauth2StateString));
	} catch (error) {
		logger.error(error);

		return SOMETHING_WENT_WRONG_ERROR_RESPONSE();
	}
}
