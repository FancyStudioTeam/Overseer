import type { CommandInteraction } from "oceanic.js";
import { Colors, Emojis } from "../../../../Constants";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Translations } from "../../../../locales";
import { UnixType, errorMessage, formatUnix } from "../../../../util/Util";

export default new SubCommand({
  name: "user",
  run: async (
    _client: Discord,
    _interaction: CommandInteraction,
    { locale }
  ) => {
    const _memberOption =
      _interaction.data.options.getMember("user") ?? _interaction.member;

    if (!_memberOption) {
      return await errorMessage(
        {
          _context: _interaction,
          ephemeral: true,
        },
        {
          description: Translations[locale].GENERAL.INVALID_GUILD_MEMBER,
        }
      );
    }

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setTitle(
          Translations[locale].COMMANDS.INFO.USER.MESSAGE_1.TITLE_1({
            name: _memberOption.user.globalName ?? _memberOption.user.username,
          })
        )
        .setThumbnail(_memberOption.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFO.USER.MESSAGE_1.FIELD_1
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.USER.MESSAGE_1.FIELD_1.VALUE({
              name: _memberOption.user.mention,
              id: _memberOption.user.id,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.USER.MESSAGE_1.FIELD_2
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.USER.MESSAGE_1.FIELD_2.VALUE({
              date: formatUnix(
                UnixType.SHORT_DATE_TIME,
                _memberOption.user.createdAt
              ),
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.USER.MESSAGE_1.FIELD_3
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.USER.MESSAGE_1.FIELD_3.VALUE({
              date: _memberOption.joinedAt
                ? formatUnix(UnixType.SHORT_DATE_TIME, _memberOption.joinedAt)
                : Emojis.MARK,
            }),
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
