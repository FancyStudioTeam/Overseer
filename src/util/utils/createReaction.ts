import { parseEmoji } from "./parseEmoji.js";

export const createReaction = (emoji: string) => {
  const { name, id } = parseEmoji(emoji);

  return `${name}:${id}`;
};
