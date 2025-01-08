import { InteractionResponseTypes } from "@discordeno/bot";
import { client } from "@index";
import type { AnyContext, Message, MessagePayload } from "@types";

export const createReplyOrMessage = async (context: AnyContext, messagePayload: MessagePayload): Promise<Message> => {
  if ("acknowledged" in context) {
    const { acknowledged, id, token } = context;

    return acknowledged
      ? await client.helpers.sendFollowupMessage(context.token, messagePayload)
      : await client.helpers
          .sendInteractionResponse(
            id,
            token,
            {
              type: InteractionResponseTypes.ChannelMessageWithSource,
              data: messagePayload,
            },
            {
              withResponse: true,
            },
          )
          .then(async () => await client.helpers.getOriginalInteractionResponse(token));
  }

  const { channelId } = context;

  return await client.helpers.sendMessage(channelId, messagePayload);
};
