import type { AnyContext, AnyMessagePayload } from "@types";
import { createMessage } from "./createMessage.js";

export const createErrorMessage = async (
  context: AnyContext,
  content: AnyMessagePayload,
  {
    shouldBeEphemeral = true,
  }: {
    shouldBeEphemeral?: boolean;
  } = {},
) =>
  await createMessage(context, content, {
    shouldBeEphemeral,
  });
