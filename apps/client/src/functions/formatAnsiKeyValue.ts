import { bold, cyan, magenta, reset } from "@discordeno/bot";

/**
 * Format a string of key-value pairs into an ANSI-formatted string.
 * @param content The string to format.
 * @param delimiter The delimiter to split between the key and value.
 * @returns The formatted key-value string pairs.
 */
export const formatAnsiKeyValues = (content: string, delimiter = "»") => {
  let maxKeyLength = 0;
  const lines = content.split("\n");
  const keyValuePairs = lines.map((line) => {
    /** Split the line into key and value. */
    const [key, value] = line.split(` ${delimiter} `);

    /**
     * Get the greater length between the key length and the maximum key length.
     * If the key length is greater than the maximum key length, set the maximum key length to the current key length.
     */
    maxKeyLength = Math.max(maxKeyLength, key.length);

    return {
      key,
      value,
    };
  });
  const formattedLines = keyValuePairs.map(({ key, value }) => {
    /** Add spaces to reach the desired key length. */
    const keyWithPads = key.padEnd(maxKeyLength);
    /** Apply bold format and magenta color to the key. */
    const formattedKey = bold(magenta(keyWithPads));
    /** Reset the formats to avoid conflicts and apply cyan color to the value. */
    const formattedValue = reset(cyan(value));

    return `${formattedKey} ${delimiter} ${formattedValue}`;
  });

  return formattedLines.join("\n");
};
