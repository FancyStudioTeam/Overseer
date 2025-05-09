import { InteractionResponseTypes } from "@discordeno/bot";
import { client } from "@util/client.js";
import type { AnyContext, AnyMessagePayload, Message } from "@util/types.js";
import { resolveMessagePayload } from "./resolveMessagePayload.js";

/**
 * Edits a message or an interaction response.
 * @param context - The context to use.
 * @param content - Any message payload kind.
 * @param options - The available options.
 * @returns The edited message depending in the context and the "withMessage" option.
 */
export const editMessage = async <Context extends AnyContext, WithMessage extends boolean>(
  context: Context,
  content: AnyMessagePayload,
  options?: EditMessageOptions<Context, WithMessage>,
): Promise<EditMessage<Context, WithMessage>> => {
  const { helpers } = client;
  const messagePayload = resolveMessagePayload(content);

  if ("acknowledged" in context) {
    const { acknowledged, id, token } = context;

    if (acknowledged) {
      return await helpers.editOriginalInteractionResponse(token, messagePayload);
    }

    await helpers.sendInteractionResponse(id, token, {
      data: messagePayload,
      type: InteractionResponseTypes.UpdateMessage,
    });

    if (options && "withMessage" in options && options.withMessage) {
      return await helpers.getOriginalInteractionResponse(token);
    }

    return undefined as EditMessage<Context, WithMessage>;
  }

  const { channelId, id } = context;

  return await helpers.editMessage(channelId, id, messagePayload);
};

interface EditMessageOptionsUsingInteraction<WithMessage extends boolean> {
  /** Whether to fetch the original message object from the interaction response. */
  withMessage?: WithMessage;
}

type EditMessageOptions<Context extends AnyContext, WithMessage extends boolean> = Context extends Message
  ? never
  : EditMessageOptionsUsingInteraction<WithMessage>;

/**
 * Conditional type that determinates the return type based on the "WithMessage" generic type.
 *
 * By default, return type will be "Message | undefined".
 * If "WithMessage" is "true", return type will be "Message".
 */
type EditMessageUsingInteraction<WithMessage extends boolean> = WithMessage extends true
  ? Message
  : Message | undefined;

/**
 * Conditional type that determinates the return type based on the context type.
 *
 * Using a message context will return "Message" type.
 * Using an interaction context will return "Message | undefined" or "Message" type if "WithMessage" generic type is "true".
 */
type EditMessage<Context extends AnyContext, WithMessage extends boolean> = Context extends Message
  ? Message
  : EditMessageUsingInteraction<WithMessage>;
