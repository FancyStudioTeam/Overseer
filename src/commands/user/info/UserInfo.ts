import {
  type AnyInteractionChannel,
  ApplicationCommandTypes,
  type CommandInteraction,
  type Uncached,
} from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { UserCommand } from "../../../classes/Builders";
import type { Discord } from "../../../classes/Client";
import { Colors, Emojis } from "../../../constants";
import { Translations } from "../../../locales";
import { UnixType } from "../../../types";
import { errorMessage, fetchMember, formatUnix } from "../../../util/util";

export default new UserCommand({
  name: "User Info",
  type: ApplicationCommandTypes.USER,
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.USER
    >,
    { locale }
  ) => {
    const _memberOption = await fetchMember(
      _interaction,
      _interaction.data.targetID
    );

    if (!_memberOption) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_MEMBER,
      });
    }

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: Translations[locale].COMMANDS.INFO.USER.MESSAGE_1.AUTHOR_1({
            name: _memberOption.user.globalName ?? _memberOption.user.username,
          }),
        })
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
