import type { CUSTOM_EMOJIS } from "@util/constants.js";

const EMOJI_REGEX = /(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,20})/;

/**
 * Parses an emoji.
 * @param emoji - The emoji to parse.
 * @returns An object containing the emoji id and name.
 */
export const parseEmoji = (emoji: Emoji): ParsedEmoji => {
  const match = emoji.match(EMOJI_REGEX);

  if (!match) {
    return {};
  }

  const [, , name, id] = match;
  const idBigInt = BigInt(id);

  return {
    id: idBigInt,
    name,
  };
};

interface ParsedEmoji {
  /** The emoji id. */
  id?: bigint;
  /** The emoji name. */
  name?: string;
}

type Emoji = keyof typeof CUSTOM_EMOJIS;
