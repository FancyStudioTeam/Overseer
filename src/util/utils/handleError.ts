import { codeBlock } from "@discordjs/formatters";
import { Translations } from "@translations";
import type { AnyContext, Locales } from "@types";
import { CreateLogMessageType, createLogMessage } from "./createLogMessage.js";
import { createMessage } from "./createMessage.js";
import { CreateWebhookMessageType, createWebhookMessage } from "./createWebhookMessage.js";
import { truncateString } from "./truncateString.js";

export const handleError = async (
  context: AnyContext,
  {
    error,
    locale,
  }: {
    error: Error;
    locale: Locales;
  },
) => {
  const truncatedMessage = truncateString(error.stack ?? error.message, {
    maxLength: 4000,
  });
  const fullCodeBlock = codeBlock("ts", truncatedMessage);

  createLogMessage(error.stack ?? error.message, {
    type: CreateLogMessageType.ERROR,
  });
  createWebhookMessage(fullCodeBlock, {
    type: CreateWebhookMessageType.ERROR,
  });

  await createMessage(context, Translations[locale].GLOBAL.SOMETHING_WENT_WRONG);
};
