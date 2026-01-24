import 'server-only';

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		const { message, stack } = error;

		return stack ?? message;
	}

	return String(error);
}
