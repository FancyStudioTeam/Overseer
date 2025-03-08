import { InteractionResponseTypes } from "@discordeno/bot";
import { client } from "@util/client.js";
import type { AnyContext, AnyMessagePayload, Message } from "@util/types.js";
import { resolveMessagePayload } from "./resolveMessagePayload.js";

/**
 * Creates a message or an interaction response.
 * @param context - The context to use.
 * @param content - Any message payload kind.
 * @param options - The available options.
 * @returns The created message depending in the context and the "withMessage" option.
 */
export const createMessage = async <Context extends AnyContext, WithMessage extends boolean>(
  context: Context,
  content: AnyMessagePayload,
  options: CreateMessageOptions<Context, WithMessage> = {
    isEphemeral: true,
    withMessage: false,
  } as CreateMessageOptions<Context, WithMessage>,
): Promise<CreateMessage<Context, WithMessage>> => {
  /**
   * The "withMessage" option should be only used when the provided context is an interaction.
   * Methods like "sendFollowupMessage" and "sendMessage" always return a message object.
   */
  const { isEphemeral } = options;
  const { helpers } = client;
  const messagePayload = resolveMessagePayload(content, {
    isEphemeral,
  });

  if ("acknowledged" in context) {
    const { acknowledged, id, token } = context;

    if (acknowledged) {
      return await helpers.sendFollowupMessage(token, messagePayload);
    }

    await helpers.sendInteractionResponse(id, token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: messagePayload,
    });

    /** Fetch and return the original message object from the interaction response only if "withMessage" is "true". */
    if ("withMessage" in options && options.withMessage) {
      return await helpers.getOriginalInteractionResponse(token);
    }

    return undefined as CreateMessage<Context, WithMessage>;
  }

  const { channelId } = context;

  return await helpers.sendMessage(channelId, messagePayload);
};

interface CreateMessageOptionsBase {
  /** Whether to include the ephemeral flag in the message payload object. */
  isEphemeral?: boolean;
}

interface CreateMessageOptionsUsingInteraction<WithMessage extends boolean> extends CreateMessageOptionsBase {
  /** Whether to fetch the original message object from the interaction response. */
  withMessage?: WithMessage;
}

type CreateMessageOptions<Context extends AnyContext, WithMessage extends boolean> = Context extends Message
  ? CreateMessageOptionsBase
  : CreateMessageOptionsUsingInteraction<WithMessage>;

/**
 * Conditional type that determinates the return type based on the "WithMessage" generic type.
 *
 * By default, return type will be "Message | undefined".
 * If "WithMessage" is "true", return type will be "Message".
 */
type CreateMessageUsingInteraction<WithMessage extends boolean> = WithMessage extends true
  ? Message
  : Message | undefined;

/**
 * Conditional type that determinates the return type based on the context type.
 *
 * Using a message context will return "Message" type.
 * Using an interaction context will return "Message | undefined" or "Message" type if "WithMessage" generic type is "true".
 */
type CreateMessage<Context extends AnyContext, WithMessage extends boolean> = Context extends Message
  ? Message
  : CreateMessageUsingInteraction<WithMessage>;
