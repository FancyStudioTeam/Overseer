import { Colors } from "@constants";
import { codeBlock } from "@discordjs/formatters";
import { client } from "@index";
import { Embed } from "oceanic-builders";
import type { EmbedOptions } from "oceanic.js";
import { parseWebhookURL } from "./parseWebhookURL.js";

export const webhook = async (
  content: string | EmbedOptions,
  {
    type,
  }: {
    type: WebhookType;
  },
) => {
  const webhookUrls: Record<
    WebhookType,
    ReturnType<typeof parseWebhookURL> & {
      username: string;
    }
  > = {
    [WebhookType.ERROR]: {
      ...parseWebhookURL(String(process.env.ERROR_WEBHOOK_URL)),
      username: "Overseer Error Logs",
    },
  };
  const { id, token, username } = webhookUrls[type];

  await client.rest.webhooks.execute(id, token, {
    embeds:
      typeof content === "string"
        ? new Embed().setDescription(codeBlock("ts", content)).setColor(Colors.COLOR).toJSON(true)
        : new Embed(content).toJSON(true),
    username,
  });
};

export enum WebhookType {
  ERROR,
}
