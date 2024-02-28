import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { translations } from "../../../../locales/translations";
import {
  errorMessage,
  fetchUser,
  formatTimestamp,
} from "../../../../util/util";

export default new SubCommand({
  name: "server",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { locale, timezone, hour12 }
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: interaction,
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
            name: translations[locale].COMMANDS.INFO.SERVER.MESSAGE.FIELD_1,
            value: translations[locale].COMMANDS.INFO.SERVER.MESSAGE.VALUE_1({
              name: interaction.guild.name,
              id: interaction.guild.id,
              owner: owner?.mention ?? "<:_:1201586248947597392>",
              createdAt: formatTimestamp(
                interaction.guild.createdAt,
                timezone,
                hour12
              ),
            }),
          },
          {
            name: translations[locale].COMMANDS.INFO.SERVER.MESSAGE.FIELD_2,
            value: translations[locale].COMMANDS.INFO.SERVER.MESSAGE.VALUE_2({
              members: interaction.guild.memberCount,
              channels: interaction.guild.channels.size,
              roles: interaction.guild.roles.size,
            }),
          },
        ])
        .setColor(client.config.colors.COLOR)
        .toJSONArray(),
    });
  },
});
