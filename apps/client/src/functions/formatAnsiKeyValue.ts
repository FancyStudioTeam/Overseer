import { bold, cyan, magenta, reset } from "@discordeno/bot";

/**
 * Formats a string of key-value pairs into an ansi formatted string.
 * @param content The string to format.
 * @param delimiter The delimiter to split between the key and value.
 * @returns The formatted key-value string pairs.
 */
export const formatAnsiKeyValues = (content: string, delimiter = "»") => {
  let maxKeyLength = 0;
  const lines = content.split("\n");
  const keyValuePairs = lines.map((line) => {
    const [key, value] = line.split(` ${delimiter} `);

    maxKeyLength = Math.max(maxKeyLength, key.length);

    return {
      key,
      value,
    };
  });
  const formattedLines = keyValuePairs.map(({ key, value }) => {
    const formattedKey = bold(magenta(key.padEnd(maxKeyLength, " ")));
    const formattedValue = reset(cyan(value));

    return `${formattedKey} ${delimiter} ${formattedValue}`;
  });

  return formattedLines.join("\n");
};
