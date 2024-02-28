import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { translations } from "../../../../locales/translations";
import { errorMessage, formatTimestamp } from "../../../../util/util";

export default new SubCommand({
  name: "user",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { locale, timezone, hour12 }
  ) => {
    const member =
      interaction.data.options.getMember("user") ?? interaction.member;

    if (!member) {
      return errorMessage(interaction, true, {
        description: translations[locale].GENERAL.INVALID_GUILD_MEMBER,
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
            name: translations[locale].COMMANDS.INFO.USER.MESSAGE.FIELD_1,
            value: translations[locale].COMMANDS.INFO.USER.MESSAGE.VALUE_1({
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
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
