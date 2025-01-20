const WEBHOOK_REGEX =
  /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i;

/**
 * Parses a webhook URL.
 * @param url The webhook URL.
 * @returns The webhook ID and token.
 */
export const parseWebhookUrl = (url: string): ParsedWebhookUrl => {
  const match = url.match(WEBHOOK_REGEX);

  if (!match) {
    return {
      id: 0n,
      token: "",
    };
  }

  const [, id, token] = match;

  return {
    id: BigInt(id),
    token,
  };
};

interface ParsedWebhookUrl {
  id: bigint;
  token: string;
}
