import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors, Emojis } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { FetchFrom, UnixType, errorMessage, fetchMember, formatUnix, sanitizeString } from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "user",
  directory: Directory.INFORMATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
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
      embeds: new EmbedBuilder()
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
            value: `${Emojis.RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, member.user.createdAt)}`,
          },
          {
            name: Translations[locale].COMMANDS.INFORMATION.USER.MESSAGE_1.FIELD_3.FIELD,
            value: `${Emojis.RIGHT} ${
              member.joinedAt ? formatUnix(UnixType.SHORT_DATE_TIME, member.joinedAt) : Emojis.MARK
            }`,
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
