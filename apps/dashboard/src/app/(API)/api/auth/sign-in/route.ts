import { randomBytes } from 'node:crypto';
import { cookies as NextCookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { logger } from '#/lib/Logger.ts';
import { createRedirectUrl } from '#/utils/functions/createRedirectUrl.ts';

const OAUTH2_STATE_BYTES_LENGTH = 24;

export async function POST() {
	try {
		const cookies = await NextCookies();

		const oauth2State = randomBytes(OAUTH2_STATE_BYTES_LENGTH);
		const oauth2StateString = oauth2State.toString('utf-8');

		cookies.set('oauth2_state', oauth2StateString);

		return NextResponse.redirect(createRedirectUrl(oauth2StateString));
	} catch (error) {
		logger.error(error);

		return NextResponse.json(
			{
				success: false,
			},
			{
				status: 500,
				statusText: 'Internal Server Error',
			},
		);
	}
}
