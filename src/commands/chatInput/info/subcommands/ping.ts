import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { formatString } from "../../../../util/util";

export default new SubCommand({
  name: "ping",
  run: async (client: Fancycord, interaction: CommandInteraction) => {
    interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          `\`\`\`ansi\n${formatString(
            `REST ∷ ${client.rest.handler.latencyRef.latency} ms\nShard ∷ ${interaction.guild?.shard.latency} ms`,
            "∷",
          )}\`\`\``,
        )
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });
  },
});
