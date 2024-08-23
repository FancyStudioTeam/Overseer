import type { NullablePartialEmoji } from "oceanic.js";

export const parseEmoji = (emoji: string): NullablePartialEmoji => {
  const match = emoji.match(/(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,20})/);

  if (match) {
    return {
      name: match[2],
      id: match[3],
    };
  }

  return {};
};
