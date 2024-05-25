import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#classes";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { version } from "#root/package.json";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { UnixType, escapeRegex, formatUnix } from "#util";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "bot",
  directory: Directory.INFORMATION,
  run: async (_client: Discord, _context: CommandInteraction, { locale }) => {
    await _context.reply({
      embeds: new EmbedBuilder()
        .setTitle(
          Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.TITLE_1({
            name: escapeRegex(_client.user.globalName ?? _client.user.username),
          }),
        )
        .setThumbnail(_client.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_1
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_1.VALUE({
              version,
              memory: `${
                Math.round(
                  (process.memoryUsage().heapUsed / 1024 / 1024) * 100,
                ) / 100
              }mb`,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_2
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_2.VALUE({
              users: _client.guilds.reduce(
                (prev, guild) => prev + guild.memberCount,
                0,
              ),
              guilds: _client.guilds.size,
              shards: _client.shards.size,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_3
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_3.VALUE({
              date: formatUnix(UnixType.SHORT_DATE_TIME, _client.readyAt),
            }),
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });
  },
});
