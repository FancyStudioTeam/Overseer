import 'server-only';

export function env(key: string): string {
	const value = process.env[key];

	if (!value) {
		throw new TypeError(`Environment variable '${key}' is missing`);
	}

	return value;
}
