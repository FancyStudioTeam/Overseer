import 'server-only';

import { randomBytes } from 'node:crypto';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const FIVE_MINUTES_IN_SECONDS = 300;
const OAUTH2_STATE_BYTES_LENGTH = 32;

/**
 * @see https://discord.com/developers/docs/topics/oauth2#state-and-security
 */
export function createAuthState(nextCookies: ReadonlyRequestCookies): string {
	const oauth2StateBytes = randomBytes(OAUTH2_STATE_BYTES_LENGTH);
	const oauth2StateString = oauth2StateBytes.toString('hex');

	nextCookies.set('oauth2_state', oauth2StateString, {
		httpOnly: true,
		maxAge: FIVE_MINUTES_IN_SECONDS,
		path: '/',
		sameSite: 'lax',
		secure: true,
	});

	return oauth2StateString;
}
