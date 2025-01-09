import { InteractionResponseTypes } from "@discordeno/bot";
import { client } from "@index";
import type { AnyContext, Message, MessagePayload } from "@types";

export const createReplyOrMessage = async <Context extends AnyContext, WithMessage extends boolean>(
  context: Context,
  messagePayload: MessagePayload,
  options: CreateReplyOrMessageOptions<WithMessage> = {
    withMessage: false,
  } as CreateReplyOrMessageOptions<WithMessage>,
): Promise<CreateMessageOrMessage<Context, WithMessage>> => {
  /**
   * The "withMessage" option is only used when the provided context is an interaction.
   * Methods like "sendFollowupMessage" and "sendMessage" always return a message object.
   */
  const { withMessage } = options;

  if ("acknowledged" in context) {
    const { acknowledged, id, token } = context;

    if (acknowledged) {
      return await client.helpers.sendFollowupMessage(token, messagePayload);
    }

    await client.helpers.sendInteractionResponse(id, token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: messagePayload,
    });

    if (withMessage) {
      return await client.helpers.getOriginalInteractionResponse(token);
    }

    return undefined as CreateMessageOrMessage<Context, WithMessage>;
  }

  const { channelId } = context;

  return await client.helpers.sendMessage(channelId, messagePayload);
};

interface CreateReplyOrMessageOptions<WithMessage extends boolean> {
  /**
   * Fetchs and returns the original message object from the interaction response.
   */
  withMessage?: WithMessage;
}

/**
 * A conditional type that determinates the return type based on the "WithMessage" generic.
 *
 * By default, return type will be "Message | undefined".
 * If "WithMessage" is "true", return type will be changed to "Message".
 */
type CreateReplyOrMessageUsingInteraction<WithMessage extends boolean> = WithMessage extends true
  ? Message
  : Message | undefined;

/**
 * A conditional type that determinates the return type based on the context.
 *
 * When using messages, return type will be "Message".
 * When using interactions, return type will be "Message | undefined".
 */
type CreateMessageOrMessage<Context extends AnyContext, WithMessage extends boolean> = Context extends Message
  ? Message
  : CreateReplyOrMessageUsingInteraction<WithMessage>;
