import { client } from "@index";
import type { AnyInteractionGateway, CreateMessageOptions, InteractionContent, Message } from "oceanic.js";

export const createReplyOrMessage = async (
  context: AnyInteractionGateway | Message,
  messagePayload: CreateMessageOptions & InteractionContent,
) =>
  "reply" in context
    ? await context.reply(messagePayload)
    : await client.rest.channels.createMessage(context.channelID, messagePayload);
