import { Embed, EmbedField } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors, Emojis } from "#constants";
import { _client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { FetchFrom, UnixType, errorMessage, fetchUser, formatUnix, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "server",
  directory: Directories.INFORMATION,
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
      embeds: new Embed()
        /*.setTitle(
          Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.TITL({
            name: sanitizeString(_context.guild.name, {
              maxLength: 50,
              espaceMarkdown: true,
            }),
          }),
        )*/
        .setThumbnail(_context.guild.iconURL() ?? _client.user.avatarURL())
        .addFields([
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_1.FIELD).setValue(
            Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_1.VALUE({
              name: sanitizeString(_context.guild.name, {
                maxLength: 50,
                espaceMarkdown: true,
              }),
              id: _context.guildID,
              owner: owner?.mention ?? Emojis.CANCEL_CIRCLE_COLOR,
            }),
          ),
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_2.FIELD).setValue(
            Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_2.VALUE({
              members: _context.guild.memberCount,
              channels: _context.guild.channels.size,
              roles: _context.guild.roles.size,
            }),
          ),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.SERVER.MESSAGE_1.FIELD_3.FIELD)
            .setValue(
              `${Emojis.EXPAND_CIRCLE_RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, _context.guild.createdAt)}`,
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
