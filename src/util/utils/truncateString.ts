import { type EscapeMarkdownOptions, escapeMarkdown as formattersEscapeMarkdown } from "@discordjs/formatters";

export const truncateString = (
  content: string,
  {
    escapeMarkdown,
    maxLength,
  }: {
    escapeMarkdown?: boolean | EscapeMarkdownOptions;
    maxLength?: number;
  } = {},
) => {
  let newContent = content;

  if (escapeMarkdown) {
    newContent =
      typeof escapeMarkdown === "boolean"
        ? formattersEscapeMarkdown(content)
        : formattersEscapeMarkdown(content, escapeMarkdown);
  }

  if (maxLength && content.length > maxLength) {
    newContent = `${content.slice(0, maxLength - 3)}...`;
  }

  return newContent;
};
