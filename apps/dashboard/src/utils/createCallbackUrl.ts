import { BASE_URL } from '#/lib/Constants.ts';

/**
 * Creates a callback URL where the users will be redirected after they
 * authorize the application.
 */
export function createCallbackUrl() {
	return `${BASE_URL}/api/auth/callback` as const;
}
