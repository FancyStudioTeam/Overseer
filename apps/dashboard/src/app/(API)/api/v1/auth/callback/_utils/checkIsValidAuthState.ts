import 'server-only';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

/**
 * @see https://discord.com/developers/docs/topics/oauth2#state-and-security
 */
export function checkIsValidAuthState(
	providedState: string,
	nextCookies: ReadonlyRequestCookies,
): boolean {
	const oauth2StateCookie = nextCookies.get('oauth2_state');

	if (!oauth2StateCookie) {
		return false;
	}

	const { value: oauth2StateCookieValue } = oauth2StateCookie;
	const isValidAuthState = providedState === oauth2StateCookieValue;

	if (isValidAuthState) {
		nextCookies.delete('oauth2_state');
	}

	return isValidAuthState;
}
