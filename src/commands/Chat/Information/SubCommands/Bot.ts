import { EmbedBuilder } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#builders";
import type { Discord } from "#client";
import { Colors, Emojis } from "#constants";
import { Translations } from "#locales";
import { version } from "#package";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { UnixType, formatUnix, sanitizeString } from "#util/Util.js";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "bot",
  directory: Directory.INFORMATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    await _context.reply({
      embeds: new EmbedBuilder()
        .setTitle(
          Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.TITLE_1({
            name: sanitizeString(_client.user.globalName ?? _client.user.username, {
              maxLength: 35,
              espaceMarkdown: true,
            }),
          }),
        )
        .setThumbnail(_client.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_1.FIELD,
            value: Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_1.VALUE({
              version: sanitizeString(version, {
                espaceMarkdown: true,
              }),
              memory: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}mb`,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_2.FIELD,
            value: Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_2.VALUE({
              users: _client.guilds.reduce((prev, guild) => prev + guild.memberCount, 0),
              guilds: _client.guilds.size,
              shards: _client.shards.size,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_3.FIELD,
            value: `${Emojis.RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, _client.readyAt)}`,
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
