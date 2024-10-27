import colors from "@colors/colors";

export const formatKeyValues = (content: string, delimiter: string) => {
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
  const formattedLines = keyValuePairs.map(
    ({ key, value }) =>
      `${colors.bold.magenta(key.padEnd(maxKeyLength, " "))} ${delimiter} ${colors.reset.cyan(value)}`,
  );

  return formattedLines.join("\n");
};
