import { BASE_URL } from '#/lib/Constants.ts';

export function createCallbackUrl() {
	return `${BASE_URL}/api/auth/callback` as const;
}
