import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { UnixType } from "../../../../types";
import { errorMessage, unix } from "../../../../util/util";

export default new SubCommand({
  name: "user",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    const member =
      interaction.data.options.getMember("user") ?? interaction.member;

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
                id: member.user.id,
                createdAt: unix(
                  member.user.createdAt.toString(),
                  UnixType.Default,
                ),
                joinedAt:
                  (member.joinedAt &&
                    unix(member.joinedAt.toString(), UnixType.Default)) ??
                  "<:_:1201586248947597392>",
                booster:
                  (member.premiumSince &&
                    unix(member.premiumSince.toString(), UnixType.Default)) ??
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
