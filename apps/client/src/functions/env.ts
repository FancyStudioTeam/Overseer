/**
 * Gets an environment variable value.
 * @param key - The environment variable to get.
 * @returns The environment variable value.
 */
export const env = (key: string): string => {
  const environmentVariable = process.env[key];

  if (!environmentVariable) {
    throw new Error(`Missing environment variable: "${key}".`);
  }

  return environmentVariable;
};
