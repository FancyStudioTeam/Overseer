import { EmbedBuilder } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#base";
import { Colors, Emojis } from "#constants";
import { _client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { FetchFrom, UnixType, errorMessage, fetchUser, formatUnix, sanitizeString } from "#util/Util.js";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "server",
  directory: Directory.INFORMATION,
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

    const owner = _context.guild.owner ?? (await fetchUser(FetchFrom.DEFAULT, _context.guild.ownerID ?? ""));

    await _context.reply({
      embeds: new EmbedBuilder()
        .setTitle(
          Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.TITLE_1({
            name: sanitizeString(_context.guild.name, {
              maxLength: 50,
              espaceMarkdown: true,
            }),
          }),
        )
        .setThumbnail(_context.guild.iconURL() ?? _client.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_1.FIELD,
            value: Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_1.VALUE({
              name: sanitizeString(_context.guild.name, {
                maxLength: 50,
                espaceMarkdown: true,
              }),
              id: _context.guildID,
              owner: owner?.mention ?? Emojis.CANCEL_CIRCLE_COLOR,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_2.FIELD,
            value: Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_2.VALUE({
              members: _context.guild.memberCount,
              channels: _context.guild.channels.size,
              roles: _context.guild.roles.size,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_3.FIELD,
            value: `${Emojis.EXPAND_CIRCLE_RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, _context.guild.createdAt)}`,
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
