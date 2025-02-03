import type { BigString } from "@discordeno/bot";

const WEBHOOK_REGEX =
  /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i;

/**
 * Parses a webhook url.
 * @param url - The webhook url to parse.
 * @returns An object with the webhook id and token.
 */
export const parseWebhookUrl = (url: string): ParsedWebhookUrl => {
  const match = url.match(WEBHOOK_REGEX);

  if (!match) {
    return {
      id: "0",
      token: "",
    };
  }

  const [, id, token] = match;

  return {
    id,
    token,
  };
};

interface ParsedWebhookUrl {
  /** The webhook id as BigString. */
  id: BigString;
  /** The webhook token. */
  token: string;
}
