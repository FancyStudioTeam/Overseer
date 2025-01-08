import { InteractionResponseTypes } from "@discordeno/bot";
import { client } from "@index";
import type { AnyContext, MessagePayload } from "@types";

export const createReplyOrMessage = async (context: AnyContext, messagePayload: MessagePayload) => {
  if ("acknowledged" in context) {
    return context.acknowledged
      ? await client.helpers.sendFollowupMessage(context.token, messagePayload)
      : await client.helpers.sendInteractionResponse(
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

  return await client.helpers.sendMessage(context.channelId, messagePayload);
};
