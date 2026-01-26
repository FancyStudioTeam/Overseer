/**
 * Gets the error message from an `Error` instance.
 *
 * @param error - The `Error` instance to get its message.
 */
export function getErrorMessage(error: unknown): string {
	if (!(error instanceof Error)) {
		return String(error);
	}

	const { message, stack } = error;

	return stack ?? message;
}
