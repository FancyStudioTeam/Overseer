import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { errorMessage, sanitizeString } from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "kick",
  permissions: {
    user: ["KICK_MEMBERS"],
    bot: ["KICK_MEMBERS"],
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

    const _memberOption = _context.data.options.getMember("user", true);
    const _reasonOption = sanitizeString(
      _context.data.options.getString("reason") ?? "No reason",
      {
        maxLength: 35,
        espaceMarkdown: true,
      },
    );

    if (
      _memberOption.id === _client.user.id ||
      _memberOption.id === _context.guild.ownerID ||
      _memberOption.id === _context.user.id
    ) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GLOBAL.CANNOT_MODERATE_MEMBER,
        },
      );
    }

    await _client.rest.guilds.removeMember(
      _context.guildID,
      _memberOption.id,
      _reasonOption,
    );

    await _context.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.MODERATION.KICK.MESSAGE_1({
            username: _memberOption.mention,
            moderator: _context.user.mention,
          }),
        )
        .setColor(Colors.SUCCESS)
        .toJSONArray(),
    });
  },
});