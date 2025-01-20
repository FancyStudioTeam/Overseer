import { THREADS_ERRORS, WEBHOOK_URL_ERRORS } from "@config";
import type { BigString } from "@discordeno/bot";
import { client } from "@index";
import type { AnyMessagePayload } from "@types";
import { parseWebhookUrl } from "./parseWebhookUrl.js";
import { resolveMessagePayload } from "./resolveMessagePayload.js";

export enum CreateWebhookMessageTypes {
  /**
   * Used to send all error messages to a private channel.
   */
  Errors = "Errors",
}

const WEBHOOK_URLS: Record<CreateWebhookMessageTypes, CreateWebhookMessageTypeOptions> = {
  [CreateWebhookMessageTypes.Errors]: {
    threadId: THREADS_ERRORS,
    webhookUrl: WEBHOOK_URL_ERRORS,
  },
};

export const createWebhookMessage = async (
  content: AnyMessagePayload,
  type = CreateWebhookMessageTypes.Errors,
): Promise<void> => {
  const { threadId, webhookUrl } = WEBHOOK_URLS[type];
  const { id, token } = parseWebhookUrl(webhookUrl);
  const messagePayload = resolveMessagePayload(content);

  await client.helpers.executeWebhook(id, token, {
    ...messagePayload,
    threadId,
  });
};

interface CreateWebhookMessageTypeOptions {
  threadId: BigString;
  webhookUrl: string;
}
