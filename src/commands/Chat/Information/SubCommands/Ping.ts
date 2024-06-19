import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import { _client } from "#index";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { errorMessage } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "ping",
  directory: Directories.INFORMATION,
  run: async (_context: CommandInteraction, { locale }) => {
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
      embeds: new Embed()
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
