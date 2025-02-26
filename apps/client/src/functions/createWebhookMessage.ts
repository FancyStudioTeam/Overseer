import type { BigString } from "@discordeno/bot";
import { client } from "@util/client.js";
import { THREADS_ERRORS, WEBHOOK_URL_ERRORS } from "@util/config.js";
import type { AnyMessagePayload } from "@util/types.js";
import { parseWebhookUrl } from "./parseWebhookUrl.js";
import { resolveMessagePayload } from "./resolveMessagePayload.js";

export enum CreateWebhookMessageTypes {
  Errors = "Errors",
}

const WEBHOOK_URLS: Record<CreateWebhookMessageTypes, CreateWebhookMessageTypeOptions> = {
  [CreateWebhookMessageTypes.Errors]: {
    threadId: THREADS_ERRORS,
    webhookUrl: WEBHOOK_URL_ERRORS,
  },
};

/**
 * Creates a webhook message.
 * @param content - Any message payload kind.
 * @param type - The webhook message type.
 */
export const createWebhookMessage = async (
  content: AnyMessagePayload,
  type = CreateWebhookMessageTypes.Errors,
): Promise<void> => {
  const { threadId, webhookUrl } = WEBHOOK_URLS[type];
  const { id, token } = parseWebhookUrl(webhookUrl);
  const { helpers } = client;
  const messagePayload = resolveMessagePayload(content);

  await helpers.executeWebhook(id, token, {
    ...messagePayload,
    threadId,
  });
};

interface CreateWebhookMessageTypeOptions {
  /** The thread id to send the webhook message. */
  threadId: BigString;
  /** The webhook url. */
  webhookUrl: string;
}
