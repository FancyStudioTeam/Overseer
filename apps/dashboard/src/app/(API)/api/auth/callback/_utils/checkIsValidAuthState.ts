import 'server-only';

import { cookies as NextCookies } from 'next/headers';

/**
 * @see https://discord.com/developers/docs/topics/oauth2#state-and-security
 */
export async function checkIsValidAuthState(state: string): Promise<boolean> {
	const cookies = await NextCookies();

	const oauth2StateCookie = cookies.get('oauth2_state');
	const { value } = oauth2StateCookie ?? {};

	const isValidAuthState = value !== undefined && state === atob(value);

	if (isValidAuthState) {
		cookies.delete('oauth2_state');
	}

	return isValidAuthState;
}
