export const env = (key: string) => {
  const environmentVariable = process.env[key];

  if (!environmentVariable) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return environmentVariable;
};
