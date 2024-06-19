import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors, Emojis } from "#constants";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { FetchFrom, UnixType, errorMessage, fetchMember, formatUnix, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "user",
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

    const member = await fetchMember(
      FetchFrom.DEFAULT,
      _context.guild,
      _context.data.options.getMember("user")?.id ?? _context.user.id,
    );

    if (!member) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_MEMBER,
      });
    }

    await _context.reply({
      embeds: new Embed()
        .setTitle(
          Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.TITLE_1({
            name: sanitizeString(member.user.globalName ?? member.user.username, {
              maxLength: 50,
              espaceMarkdown: true,
            }),
          }),
        )
        .setThumbnail(member.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_1.FIELD,
            value: Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_1.VALUE({
              name: member.user.mention,
              id: member.user.id,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_2.FIELD,
            value: `${Emojis.EXPAND_CIRCLE_RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, member.user.createdAt)}`,
          },
          {
            name: Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_3.FIELD,
            value: `${Emojis.EXPAND_CIRCLE_RIGHT} ${member.joinedAt ? formatUnix(UnixType.SHORT_DATE_TIME, member.joinedAt) : Emojis.CANCEL_CIRCLE_COLOR}`,
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
