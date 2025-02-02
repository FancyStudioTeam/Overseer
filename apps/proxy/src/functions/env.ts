/**
 * Gets an environment variable value.
 * @param key The environment variable key.
 * @returns The environment variable value.
 */
export const env = (key: string): string => {
  const environmentVariable = process.env[key];

  /** Throw an error if the environment variable is not defined. */
  if (!environmentVariable) {
    throw new Error(`Missing environment variable: "${key}".`);
  }

  return environmentVariable;
};
