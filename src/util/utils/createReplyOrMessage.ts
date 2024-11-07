import { client } from "@index";
import type { MessagePayload } from "@types";
import type { AnyInteractionGateway, Message } from "oceanic.js";

export const createReplyOrMessage = async (context: AnyInteractionGateway | Message, messagePayload: MessagePayload) =>
  "reply" in context
    ? await context
        .reply(messagePayload)
        .then(async (repliedMessage) =>
          repliedMessage.hasMessage() ? repliedMessage.message : await repliedMessage.getMessage(),
        )
    : await client.rest.channels.createMessage(context.channelID, messagePayload);
