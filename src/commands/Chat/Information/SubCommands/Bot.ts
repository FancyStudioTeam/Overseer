import { Embed, EmbedField } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors, Emojis } from "#constants";
import { _client } from "#index";
import { version } from "#package";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";
import { UnixType, formatUnix, sanitizeString } from "#util/Util.js";

export default new Base<ChatInputSubCommand>({
  name: "bot",
  directory: Directories.INFORMATION,
  run: async (_context: CommandInteraction, { locale }) => {
    await _context.reply({
      embeds: new Embed()
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
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_1.FIELD).setValue(
            Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_1.VALUE({
              version: sanitizeString(version, {
                espaceMarkdown: true,
              }),
              memory: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}mb`,
            }),
          ),
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_2.FIELD).setValue(
            Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_2.VALUE({
              users: _client.guilds.reduce((prev, guild) => prev + guild.memberCount, 0),
              guilds: _client.guilds.size,
              shards: _client.shards.size,
            }),
          ),
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.BOT.MESSAGE_1.FIELD_3.FIELD)
            .setValue(`${Emojis.EXPAND_CIRCLE_RIGHT} ${formatUnix(UnixType.SHORT_DATE_TIME, _client.readyAt)}`),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
