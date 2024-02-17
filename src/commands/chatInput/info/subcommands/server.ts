import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { errorMessage, fetchUser, formatDate } from "../../../../util/util";

export default new SubCommand({
  name: "server",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language, timezone, hour12 },
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
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
                owner: owner?.mention ?? "<:_:1201586248947597392>",
                createdAt: formatDate(
                  timezone,
                  interaction.guild.createdAt,
                  hour12,
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
              },
            ),
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
