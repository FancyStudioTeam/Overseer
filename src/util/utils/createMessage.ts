import type { AnyContext, AnyMessagePayload } from "@types";
import { createReplyOrMessage } from "./createReplyOrMessage.js";
import { resolveMessagePayload } from "./resolveMessagePayload.js";

export const createMessage = async (
  context: AnyContext,
  content: AnyMessagePayload,
  {
    shouldBeEphemeral = true,
  }: {
    shouldBeEphemeral?: boolean;
  } = {},
) => {
  const resolvedMessagePayload = resolveMessagePayload(content, {
    shouldBeEphemeral,
  });

  return await createReplyOrMessage(context, resolvedMessagePayload);
};
