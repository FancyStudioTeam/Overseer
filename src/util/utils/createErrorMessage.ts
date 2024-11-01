import type { AnyInteractionGateway, CreateMessageOptions, EmbedOptions, Message } from "oceanic.js";
import { createMessage } from "./createMessage.js";

export const createErrorMessage = async (
  context: AnyInteractionGateway | Message,
  content: string | EmbedOptions | CreateMessageOptions,
  {
    shouldBeEphemeral = true,
  }: {
    shouldBeEphemeral?: boolean;
  } = {},
) =>
  await createMessage(context, content, {
    shouldBeEphemeral,
  });
