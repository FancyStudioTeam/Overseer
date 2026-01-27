import { env } from 'node:process';

/**
 * Gets an environment variable value using its name.
 *
 * @param variableName - The name of the environment variable.
 *
 * @remarks
 * This method throws an error if the environment variable is not configured.
 */
export function getEnvVariable(variableName: string): string {
	const variable = env[variableName];

	if (!variable) {
		throw new TypeError(`Environment variable '${variableName}' is not configured`);
	}

	return variable;
}
