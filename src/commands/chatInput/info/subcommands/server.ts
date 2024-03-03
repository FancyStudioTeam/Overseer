import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { Colors, Emojis } from "../../../../constants";
import { Translations } from "../../../../locales/index";
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
        description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
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
            name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_1
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_1.VALUE({
              name: interaction.guild.name,
              id: interaction.guild.id,
              owner: owner?.mention ?? Emojis.MARK,
              createdAt: formatTimestamp(
                interaction.guild.createdAt,
                timezone,
                hour12
              ),
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_2
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.SERVER.MESSAGE_1.FIELD_2.VALUE({
              members: interaction.guild.memberCount,
              channels: interaction.guild.channels.size,
              roles: interaction.guild.roles.size,
            }),
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
