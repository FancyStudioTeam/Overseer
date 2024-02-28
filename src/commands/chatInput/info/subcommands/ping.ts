import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { translations } from "../../../../locales/translations";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "ping",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { locale }
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: interaction,
        }),
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .addFields([
          {
            name: "**REST**",
            value: `${client.config.emojis.RIGHT} ${client.rest.handler.latencyRef.latency}ms`,
            inline: true,
          },
          {
            name: "**WS**",
            value: `${client.config.emojis.RIGHT} ${interaction.guild.shard.latency}ms`,
            inline: true,
          },
        ])
        .setColor(client.config.colors.COLOR)
        .toJSONArray(),
    });
  },
});
