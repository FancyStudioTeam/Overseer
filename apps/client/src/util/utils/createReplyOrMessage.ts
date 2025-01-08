import { InteractionResponseTypes } from "@discordeno/bot";
import { client } from "@index";
import type { AnyContext, Message, MessagePayload } from "@types";

export const createReplyOrMessage = async <WithMessage extends boolean>(
  context: AnyContext,
  messagePayload: MessagePayload,
  options: CreateReplyOrMessageOptions<WithMessage> = {
    withMessage: false,
  } as CreateReplyOrMessageOptions<WithMessage>,
): Promise<CreateReplyOrMessageData<WithMessage>> => {
  /**
   * The "withMessage" option is required when the interaction has not been acknowledged yet.
   * Other functions like "sendFollowupMessage" and "sendMessage" already return the original message.
   * This option is used to get the original message when it is required and avoiding unnecessary requests.
   */
  const { withMessage } = options;

  if ("acknowledged" in context) {
    const { acknowledged, id, token } = context;

    if (acknowledged) {
      return await client.helpers.sendFollowupMessage(token, messagePayload);
    }

    return (await client.helpers
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
      .then(async () =>
        /**
         * If "withMessage" is "true", it returns the original interaction response message.
         * Otherwise, it returns "undefined".
         */
        withMessage ? await client.helpers.getOriginalInteractionResponse(token) : undefined,
      )) as CreateReplyOrMessageData<WithMessage>;
  }

  const { channelId } = context;

  return await client.helpers.sendMessage(channelId, messagePayload);
};

interface CreateReplyOrMessageOptions<WithMessage extends boolean> {
  withMessage?: WithMessage;
}

/**
 * Determinates if function should return a message.
 * If "WithMessage" is "true", it returns a message.
 * Otherwise, it may return a message or "undefined".
 */
type CreateReplyOrMessageData<WithMessage extends boolean> = WithMessage extends true ? Message : Message | undefined;
