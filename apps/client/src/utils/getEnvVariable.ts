import { env } from 'node:process';

/**
 * @remarks
 * - This method throws an error if the specified environment variable is not
 *   configured.
 */
export function getEnvVariable(variableName: string): string {
	const variable = env[variableName];

	if (!variable) {
		throw new TypeError(
			`Environment variable '${variableName}' is not configured`,
		);
	}

	return variable;
}
