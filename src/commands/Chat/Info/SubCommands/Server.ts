import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#classes";
import { Colors, Emojis } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import {
  FetchFrom,
  UnixType,
  errorMessage,
  escapeRegex,
  fetchUser,
  formatUnix,
} from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "server",
  directory: Directory.INFORMATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
            structure: _context,
          }),
        },
      );
    }

    const owner =
      _context.guild.owner ??
      (await fetchUser(FetchFrom.DEFAULT, _context.guild.ownerID ?? ""));

    await _context.reply({
      embeds: new EmbedBuilder()
        .setTitle(
          Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.TITLE_1({
            name: escapeRegex(_context.guild.name),
          }),
        )
        .setThumbnail(_context.guild.iconURL() ?? _client.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_1
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_1.VALUE({
              name: escapeRegex(_context.guild.name),
              id: _context.guildID,
              owner: owner?.mention ?? Emojis.MARK,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_2
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_2.VALUE({
              members: _context.guild.memberCount,
              channels: _context.guild.channels.size,
              roles: _context.guild.roles.size,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_3
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_3.VALUE({
              date: formatUnix(
                UnixType.SHORT_DATE_TIME,
                _context.guild.createdAt,
              ),
            }),
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
