import type { NullablePartialEmoji } from "oceanic.js";

const EMOJI_REGEX = /(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,20})/;

export const parseEmoji = (emoji: string): NullablePartialEmoji => {
  const match = emoji.match(EMOJI_REGEX);

  if (!match) {
    return {};
  }

  const [, , name, id] = match;

  return {
    name,
    id,
  };
};
