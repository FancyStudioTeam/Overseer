import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import {
  errorMessage,
  sanitizeString,
} from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "unban",
  permissions: {
    user: ["BAN_MEMBERS"],
    bot: ["BAN_MEMBERS"],
  },
  directory: Directory.MODERATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
            structure: _context,
          }),
        },
      );
    }

    const _userOption = _context.data.options.getUser("user", true);
    const _reasonOption = sanitizeString(
        _context.data.options.getString("reason") ?? "No reason",
        {
          maxLength: 50,
          espaceMarkdown: true,
        },
      );

    if (!_userOption) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
        },
      );
    }

    const bannedUser = await _client.rest.guilds.getBan(_context.guildID, _userOption.id);

    if (!bannedUser) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].COMMANDS.MODERATION.UNBAN.INVALID_BANNED_USER,
        },
      );
    }

    await _client.rest.guilds.removeBan(_context.guildID, _userOption.id, _reasonOption);

    await _context.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.UNBAN.MESSAGE_1({
            user: _userOption.mention,
            moderator: _context.user.mention,
            reason: _reasonOption,
          }),
        )
        .setColor(Colors.SUCCESS)
        .toJSONArray(),
    });
  },
});
