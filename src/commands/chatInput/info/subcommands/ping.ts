import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";

export default new SubCommand({
  name: "ping",
  run: async (client: Fancycord, interaction: CommandInteraction) => {
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
            value: `<:_:1201948012830531644> ${
              interaction.guild?.shard.latency ?? 0
            } ms`,
            inline: true,
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
