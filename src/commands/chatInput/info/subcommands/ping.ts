import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "ping",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language }
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .addFields([
          {
            name: "**REST**",
            value: `<:_:1201948012830531644> ${client.rest.handler.latencyRef.latency} ms`,
            inline: true,
          },
          {
            name: "**WS**",
            value: `<:_:1201948012830531644> ${interaction.guild.shard.latency} ms`,
            inline: true,
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
