import { client } from "@index";
import { delay } from "es-toolkit";
import type { CreateMessageOptions, Message } from "oceanic.js";
import { match } from "ts-pattern";
import type { Function } from "yamlcord";

export const executeFunction = (
  globalFunction: Function,
  {
    message,
  }: {
    message: Message;
  },
) => {
  if (!(message.inCachedGuildChannel() && message.guild)) return;

  match(globalFunction)
    .with(
      {
        name: "add_reaction",
      },
      async ({ data }) => {
        if (Array.isArray(data)) {
          for (const emoji of data) {
            await delay(1000);
            await client.rest.channels.createReaction(message.channelID, message.id, emoji);
          }
        } else {
          await client.rest.channels.createReaction(message.channelID, message.id, data);
        }
      },
    )
    .with(
      {
        name: "create_message",
      },
      async ({ data }) => {
        const content = typeof data === "string" ? data : data.content;
        let channelId = message.channelID;
        const messagePayload: CreateMessageOptions = {
          content,
        };

        if (typeof data === "object") {
          if (data.channel_id) {
            const channel = message.guild?.channels.get(data.channel_id);

            if (channel) {
              channelId = channel.id;
            }
          }

          if (data.reply) {
            messagePayload.messageReference = {
              messageID: message.id,
              failIfNotExists: false,
            };
            messagePayload.allowedMentions = {
              repliedUser: data.reply === "ping",
            };
          }
        }

        await client.rest.channels.createMessage(channelId, messagePayload);
      },
    )
    .with(
      {
        name: "wait",
      },
      async ({ data }) => await delay(data),
    );
};
