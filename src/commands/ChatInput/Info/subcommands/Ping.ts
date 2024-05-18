import type {
  AnyInteractionChannel,
  ApplicationCommandTypes,
  CommandInteraction,
  Uncached,
} from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Colors } from "../../../../constants";
import { Translations } from "../../../../locales";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "ping",
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >,
    { locale }
  ) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: _interaction,
        }),
      });
    }

    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.INFO.PING.MESSAGE_1.DESCRIPTION_1({
            rest: `${_client.rest.handler.latencyRef.latency}ms`,
            shard: `${_interaction.guild.shard.latency}ms`,
          })
        )
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});