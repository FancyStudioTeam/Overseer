import 'server-only';

import { randomBytes } from 'node:crypto';
import type { cookies } from 'next/headers';

const FIVE_MINUTES_IN_SECONDS = 300;
const OAUTH2_STATE_BYTES_LENGTH = 32;

/**
 * @see https://discord.com/developers/docs/topics/oauth2#state-and-security
 */
export function createAuthState(nextCookies: NextCookies): string {
	const oauth2StateBytes = randomBytes(OAUTH2_STATE_BYTES_LENGTH);
	const oauth2State = oauth2StateBytes.toString('hex');

	nextCookies.set('oauth2_state', oauth2State, {
		httpOnly: true,
		maxAge: FIVE_MINUTES_IN_SECONDS,
		path: '/api/v1/auth',
		sameSite: 'lax',
		secure: true,
	});

	return oauth2State;
}

type NextCookies = Awaited<ReturnType<typeof cookies>>;
