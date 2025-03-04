const CUSTOM_ID_REGEX = /^(.*?)(?:#\[(.*?)\])?$/;

/**
 * Parses a custom id.
 * @param id - The custom id to parse.
 * @returns An object containing the custom id and some values.
 */
export const parseCustomId = (id: string): ParsedCustomId => {
  const match = id.match(CUSTOM_ID_REGEX);

  if (!match) {
    return {
      customId: id,
      values: [],
    };
  }

  const [, customId, values] = match;
  const splittedValues = values?.split(",") ?? [];

  return {
    customId,
    values: splittedValues,
  };
};

interface ParsedCustomId {
  /** The custom id retreived from the string. */
  customId: string;
  /** The values retreived from the string. */
  values: string[];
}
