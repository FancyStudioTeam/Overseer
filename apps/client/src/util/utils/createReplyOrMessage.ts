import { InteractionResponseTypes } from "@discordeno/bot";
import { client } from "@index";
import type { AnyContext, MessagePayload } from "@types";

export const createReplyOrMessage = async (context: AnyContext, messagePayload: MessagePayload) => {
  if ("acknowledged" in context) {
    return context.acknowledged
      ? await client.rest.sendFollowupMessage(context.token, messagePayload)
      : await client.rest.sendInteractionResponse(
          context.id,
          context.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: messagePayload,
          },
          {
            withResponse: true,
          },
        );
  }

  return await client.rest.sendMessage(context.channelId, messagePayload);
};
