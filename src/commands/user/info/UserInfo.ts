import { ApplicationCommandTypes, type CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { UserCommand } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { errorMessage, fetchMember, formatDate } from "../../../util/util";

export default new UserCommand({
  name: "User Info",
  type: ApplicationCommandTypes.USER,
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language, timezone, hour12 },
  ) => {
    const member = await fetchMember(
      interaction,
      interaction.data.targetID ?? "",
    );

    if (!member) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.information.info.invalid-guild-member",
          locale: language,
        }),
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
            name: client.locales.__({
              phrase: "commands.information.user.message.field",
              locale: language,
            }),
            value: client.locales.__mf(
              {
                phrase: "commands.information.user.message.value",
                locale: language,
              },
              {
                user: member.user.mention,
                createdAt: formatDate(timezone, member.user.createdAt, hour12),
                joinedAt:
                  (member.joinedAt &&
                    formatDate(timezone, member.joinedAt, hour12)) ??
                  "<:_:1201586248947597392>",
                booster:
                  (member.premiumSince &&
                    formatDate(timezone, member.premiumSince, hour12)) ??
                  "<:_:1201586248947597392>",
              },
            ),
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
