import { DiscordSnowflake } from "@sapphire/snowflake";
import { Translations } from "@translations";
import type { Locales } from "@types";
import type { AnyInteractionGateway, Message } from "oceanic.js";
import { createMessage } from "./createMessage.js";
import { LoggerType, logger } from "./logger.js";
import { WebhookType, webhook } from "./webhook.js";

export const handleError = async (
  context: AnyInteractionGateway | Message,
  {
    error,
    locale,
  }: {
    error: Error;
    locale: Locales;
  },
) => {
  logger(error.stack ?? error.message, {
    type: LoggerType.ERROR,
  });
  webhook(error.stack ?? error.message, {
    type: WebhookType.ERROR,
  });

  const reportId = DiscordSnowflake.generate().toString();

  await createMessage(
    context,
    Translations[locale].GLOBAL.SOMETHING_WENT_WRONG({
      reportId,
    }),
  );
};
