import { DiscordSnowflake } from "@sapphire/snowflake";
import { captureException } from "@sentry/node";
import { ActionRow, Button, Embed } from "oceanic-builders";
import {
  type AnyInteractionGateway,
  ButtonStyles,
  type CreateMessageOptions,
  type InteractionContent,
  type Message,
} from "oceanic.js";
import { Colors, Emojis, Links } from "#constants";
import { Translations } from "#translations";
import type { Locales } from "#types";
import { createMessage } from "./createMessage";
import { LoggerType, logger } from "./logger";
import { parseEmoji } from "./parseEmoji";

export const handleError = async ({
  context,
  error,
  locale,
}: {
  context: AnyInteractionGateway | Message;
  error: Error;
  locale: Locales;
}) => {
  captureException(error);
  logger(error.stack ?? error.message, {
    type: LoggerType.ERROR,
  });

  const id = DiscordSnowflake.generate().toString();
  const messagePayload: CreateMessageOptions & InteractionContent = {
    embeds: new Embed()
      .setDescription(
        Translations[locale].GLOBAL.SOMETHING_WENT_WRONG.MESSAGE_1({
          name: error.name,
          id,
        }),
      )
      .setColor(Colors.RED)
      .toJSON(true),
    components: new ActionRow()
      .addComponents([
        new Button()
          .setLabel(Translations[locale].GLOBAL.SOMETHING_WENT_WRONG.COMPONENTS.BUTTONS.SUPPORT.LABEL)
          .setStyle(ButtonStyles.LINK)
          .setEmoji(parseEmoji(Emojis.LIFE_BUOY))
          .setURL(Links.SUPPORT),
      ])
      .toJSON(true),
  };

  await createMessage(context, messagePayload);
};
