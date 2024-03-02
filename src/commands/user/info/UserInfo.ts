import { ApplicationCommandTypes, type CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { UserCommand } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { Colors } from "../../../constants";
import { Translations } from "../../../locales/index";
import { errorMessage, fetchMember, formatTimestamp } from "../../../util/util";

export default new UserCommand({
  name: "User Info",
  type: ApplicationCommandTypes.USER,
  run: async (
    _client: Fancycord,
    interaction: CommandInteraction,
    { locale, timezone, hour12 }
  ) => {
    const member = await fetchMember(
      interaction,
      interaction.data.targetID ?? interaction.user.id
    );

    if (!member) {
      return errorMessage(interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_MEMBER,
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.avatarURL(),
        })
        .setThumbnail(member.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFO.USER.MESSAGE.FIELD_1.FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.USER.MESSAGE.FIELD_1.VALUE({
              name: member.user.mention,
              id: member.user.id,
              createdAt: formatTimestamp(
                member.user.createdAt,
                timezone,
                hour12
              ),
              joinedAt:
                (member.joinedAt &&
                  formatTimestamp(member.joinedAt, timezone, hour12)) ??
                "<:_:1201586248947597392>",
              booster:
                (member.premiumSince &&
                  formatTimestamp(member.premiumSince, timezone, hour12)) ??
                "<:_:1201586248947597392>",
            }),
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
