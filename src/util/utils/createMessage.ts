import { client } from "@index";
import type { AnyInteractionGateway, CreateMessageOptions, InteractionContent, Message } from "oceanic.js";

export const createMessage = async (
  context: AnyInteractionGateway | Message,
  messagePayload: CreateMessageOptions & InteractionContent,
) => {
  return "reply" in context
    ? await context.reply(messagePayload)
    : await client.rest.channels.createMessage(context.channelID, messagePayload);
};
