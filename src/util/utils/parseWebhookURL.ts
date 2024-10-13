const WEBHOOK_REGEX =
  /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i;

export const parseWebhookURL = (
  url: string,
): {
  id: string;
  token: string;
} => {
  const match = url.match(WEBHOOK_REGEX);

  if (!match) {
    return {
      id: "",
      token: "",
    };
  }

  const [, id, token] = match;

  return {
    id,
    token,
  };
};
