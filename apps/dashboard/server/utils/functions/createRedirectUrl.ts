import { BASE_URL } from '#imports';

export function createRedirectUrl() {
	return `${BASE_URL}/api/auth/callback` as const;
}
