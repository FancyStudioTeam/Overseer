import { DiscordSnowflake } from "@sapphire/snowflake";
import { Duration } from "@sapphire/time-utilities";
import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#base";
import { Colors } from "#constants";
import { _client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { errorMessage } from "#util/Util.js";

export default new BaseBuilder<ChatInputSubCommand>({
  name: "purge",
  permissions: {
    user: ["MANAGE_MESSAGES"],
    bot: ["MANAGE_MESSAGES"],
  },
  directory: Directories.MODERATION,
  run: async (_context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: _context,
        }),
      });
    }

    const _amountOption = _context.data.options.getInteger("amount", true);
    const fetchedMessages = await _client.rest.channels.getMessages(_context.channelID, {
      limit: _amountOption + 1,
    });

    if (!fetchedMessages.length) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.PURGE.NO_RECENT_MESSAGES,
      });
    }

    const filteredMessages = fetchedMessages
      .slice(1)
      .filter(
        (message) => Date.now() - DiscordSnowflake.timestampFrom(message.id) < new Duration("14 days").offset / 1000,
      )
      .map((message) => message.id);

    if (!filteredMessages.length) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].COMMANDS.MODERATION.PURGE.NO_RECENT_MESSAGES,
      });
    }

    const purgedMessages = await _context.channel.deleteMessages(filteredMessages);

    await _context.reply({
      embeds: new Embed()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.PURGE.MESSAGE_1({
            messages: purgedMessages,
          }),
        )
        .setColor(Colors.GREEN)
        .toJSONArray(),
    });
  },
});
