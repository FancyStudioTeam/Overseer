import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { Colors, Emojis } from "../../../../constants";
import { Translations } from "../../../../locales";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "ping",
  run: async (
    _client: Fancycord,
    _interaction: CommandInteraction,
    { locale }
  ) => {
    if (!_interaction.inCachedGuildChannel() || !_interaction.guild) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: _interaction,
        }),
      });
    }

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .addFields([
          {
            name: "**REST**",
            value: `${Emojis.RIGHT} ${_client.rest.handler.latencyRef.latency}ms`,
            inline: true,
          },
          {
            name: "**WS**",
            value: `${Emojis.RIGHT} ${_interaction.guild.shard.latency}ms`,
            inline: true,
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
