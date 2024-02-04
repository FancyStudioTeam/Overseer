import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { UnixType } from "../../../../types";
import { errorMessage, fetchUser, unix } from "../../../../util/util";

export default new SubCommand({
  name: "server",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    if (!interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    const owner =
      interaction.guild.owner ??
      (await fetchUser(interaction.guild.ownerID ?? ""));

    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL() ?? client.user.avatarURL(),
        })
        .setThumbnail(interaction.guild.iconURL() ?? client.user.avatarURL())
        .addFields([
          {
            name: client.locales.__({
              phrase: "commands.information.server.message.field",
              locale: language,
            }),
            value: client.locales.__mf(
              {
                phrase: "commands.information.server.message.value",
                locale: language,
              },
              {
                name: interaction.guild.name,
                id: interaction.guild.id,
                owner: owner?.mention ?? "<:_:1201586248947597392>",
                ownerId:
                  interaction.guild.ownerID ?? "<:_:1201586248947597392>",
                createdAt: unix(
                  interaction.guild.createdAt.toString(),
                  UnixType.Default,
                ),
              },
            ),
          },
          {
            name: client.locales.__({
              phrase: "commands.information.server.message.field2",
              locale: language,
            }),
            value: client.locales.__mf(
              {
                phrase: "commands.information.server.message.value2",
                locale: language,
              },
              {
                members: interaction.guild.memberCount,
                channels: interaction.guild.channels.size,
                roles: interaction.guild.roles.size,
                emojis: interaction.guild.emojis.size,
              },
            ),
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
