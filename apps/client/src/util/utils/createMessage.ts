import type { AnyContext, AnyMessagePayload } from "@types";
import { createReplyOrMessage } from "./createReplyOrMessage.js";
import { resolveMessagePayload } from "./resolveMessagePayload.js";

export const createMessage = async (
  context: AnyContext,
  content: AnyMessagePayload,
  options: CreateMessageOptions = {
    isEphemeral: false,
  },
) => {
  const { isEphemeral } = options;
  const messagePayload = resolveMessagePayload(content, {
    isEphemeral,
  });

  return await createReplyOrMessage(context, messagePayload);
};

interface CreateMessageOptions {
  isEphemeral?: boolean;
}
