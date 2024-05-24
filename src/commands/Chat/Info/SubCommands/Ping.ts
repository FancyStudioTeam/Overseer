import type { CommandInteraction } from "oceanic.js";
import { Colors } from "../../../../Constants";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Translations } from "../../../../locales";
import { errorMessage } from "../../../../util/Util";

export default new SubCommand({
  name: "ping",
  run: async (
    _client: Discord,
    _interaction: CommandInteraction,
    { locale },
  ) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) {
      return await errorMessage(
        {
          _context: _interaction,
          ephemeral: true,
        },
        {
          description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
            structure: _interaction,
          }),
        },
      );
    }

    await _interaction
      .reply({
        embeds: new EmbedBuilder()
          .setDescription(
            Translations[locale].COMMANDS.INFO.PING.MESSAGE_1.DESCRIPTION_1({
              rest: `${_client.rest.handler.latencyRef.latency}ms`,
              shard: `${_interaction.guild.shard.latency}ms`,
            }),
          )
          .setColor(Colors.COLOR)
          .toJSONArray(),
      })
      .catch(() => null);
  },
});
