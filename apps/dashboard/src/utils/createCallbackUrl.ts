import 'server-only';
import { BASE_URL } from '#/lib/Constants.ts';

export function createCallbackUrl() {
	return `${BASE_URL}/api/v1/auth/callback` as const;
}
