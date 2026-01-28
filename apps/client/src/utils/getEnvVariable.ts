import { env } from 'node:process';

/**
 * Gets the value of the specified environment variable.
 *
 * @param variableName - The name of the environment variable to get.
 * @returns The value of the specified environment variable.
 *
 * @remarks
 * This method throws an error if the specified environment variable is not
 * configured.
 */
export function getEnvVariable(variableName: string): string {
	const variable = env[variableName];

	if (!variable) {
		throw new TypeError(`Environment variable '${variableName}' is not configured`);
	}

	return variable;
}
