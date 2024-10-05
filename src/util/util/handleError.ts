import { Colors } from "@constants";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { createErrorCardImage } from "@util/Canvas";
import { Attachment, Embed } from "oceanic-builders";
import type { AnyInteractionGateway, Message } from "oceanic.js";
import { createMessage } from "./createMessage.js";
import { LoggerType, logger } from "./logger.js";

export const handleError = async (
  error: Error,
  {
    context,
  }: {
    context: AnyInteractionGateway | Message;
  },
) => {
  logger(error.stack ?? error.message, {
    type: LoggerType.ERROR,
  });

  const reportId = DiscordSnowflake.generate().toString();
  const errorCardImage = await createErrorCardImage(reportId);

  await createMessage(context, {
    embeds: new Embed().setImage("attachment://ErrorCard.png").setColor(Colors.RED).toJSON(true),
    files: new Attachment().setContents(errorCardImage).setName("ErrorCard.png").toJSON(true),
  });
};
