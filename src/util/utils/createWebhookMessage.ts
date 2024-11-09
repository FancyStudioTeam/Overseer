import { Colors, WebhooksThreadIds } from "@constants";
import { client } from "@index";
import { Embed } from "oceanic-builders";
import type { EmbedOptions, ExecuteWebhookOptions } from "oceanic.js";
import { parseWebhookURL } from "./parseWebhookURL.js";

export enum CreateWebhookMessageType {
  ERROR,
  ERROR_REPORT,
  JOIN_LEAVE,
}

const WEBHOOK_URLS: Record<
  CreateWebhookMessageType,
  {
    threadId: string;
    webhookUrl: string;
  }
> = {
  [CreateWebhookMessageType.ERROR]: {
    threadId: WebhooksThreadIds.ERROR,
    webhookUrl: process.env.ERROR_NOTIFICATIONS_URL ?? "",
  },
  [CreateWebhookMessageType.ERROR_REPORT]: {
    threadId: WebhooksThreadIds.ERROR_REPORT,
    webhookUrl: process.env.ERROR_REPORT_NOTIFICATIONS_URL ?? "",
  },
  [CreateWebhookMessageType.JOIN_LEAVE]: {
    threadId: WebhooksThreadIds.JOIN_LEAVE,
    webhookUrl: process.env.JOIN_LEAVE_NOTIFICATIONS_URL ?? "",
  },
};

export const createWebhookMessage = async (
  content: string | EmbedOptions | ExecuteWebhookOptions,
  {
    type,
  }: {
    type: CreateWebhookMessageType;
  } = {
    type: CreateWebhookMessageType.ERROR,
  },
) => {
  const { threadId, webhookUrl } = WEBHOOK_URLS[type];
  const { id, token } = parseWebhookURL(webhookUrl);
  let webhookPayload: ExecuteWebhookOptions = {
    threadID: threadId,
  };

  if (typeof content === "string") {
    webhookPayload.embeds = new Embed().setDescription(content).setColor(Colors.COLOR).toJSON(true);
  }

  if (typeof content === "object") {
    if (
      "components" in content ||
      "content" in content ||
      "embeds" in content ||
      "files" in content ||
      "flags" in content ||
      "username" in content
    ) {
      webhookPayload = {
        ...webhookPayload,
        ...content,
      };
    } else {
      webhookPayload.embeds = new Embed(content as EmbedOptions).setColor(Colors.COLOR).toJSON(true);
    }
  }

  return await client.rest.webhooks.execute(id, token, webhookPayload);
};
