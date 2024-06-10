import { EmbedBuilder } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#base";
import type { Discord } from "#client";
import { Colors } from "#constants";
import { Translations } from "#translations";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { errorMessage } from "#util/Util.js";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "ping",
  directory: Directory.INFORMATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage({
        _context,
        ephemeral: true,
        message: Translations[locale].GLOBAL.INVALID_GUILD_PROPERTY({
          structure: _context,
        }),
      });
    }

    await _context.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.INFORMATION.PING.MESSAGE_1.DESCRIPTION_1({
            rest: `${_client.rest.handler.latencyRef.latency}ms`,
            shard: `${_context.guild.shard.latency}ms`,
          }),
        )
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
