import { DiscordSnowflake } from "@sapphire/snowflake";
import { Duration } from "@sapphire/time-utilities";
import { chunk } from "@sapphire/utilities";
import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { errorMessage } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "purge",
  permissions: {
    user: ["MANAGE_MESSAGES"],
    bot: ["MANAGE_MESSAGES"],
  },
  directory: Directories.MODERATION,
  run: async (context: CommandInteraction, { locale }) => {
    if (!(context.inCachedGuildChannel() && context.guild)) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: context,
        }),
      });
    }

    const _amountOption = context.data.options.getInteger("amount", true);
    const fetchedMessages = await client.rest.channels.getMessages(context.channelID, {
      limit: _amountOption + 1,
    });

    if (!fetchedMessages.length) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.PURGE.NO_RECENT_MESSAGES,
      });
    }

    const filteredMessages = fetchedMessages
      .slice(1)
      .filter((message) => Date.now() - DiscordSnowflake.timestampFrom(message.id) < new Duration("14 days").offset)
      .map((message) => message.id);

    if (!filteredMessages.length) {
      return await errorMessage({
        context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.PURGE.NO_RECENT_MESSAGES,
      });
    }

    const chunks = chunk(filteredMessages, 100);
    let purgedMessages = 0;

    for (const chunk of chunks) {
      purgedMessages += await client.rest.channels.deleteMessages(context.channelID, chunk);
    }

    await context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.PURGE.MESSAGE_1({
            messages: purgedMessages,
          }),
        )
        .setColor(Colors.GREEN)
        .toJSON(true),
    });
  },
});
