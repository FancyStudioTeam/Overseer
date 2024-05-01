import type {
  AnyInteractionChannel,
  ApplicationCommandTypes,
  CommandInteraction,
  Uncached,
} from "oceanic.js";
import { version } from "../../../../../package.json";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Colors } from "../../../../constants";
import { Translations } from "../../../../locales";
import { UnixType } from "../../../../types";
import { formatUnix } from "../../../../util/util";

export default new SubCommand({
  name: "bot",
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >,
    { locale }
  ) => {
    await _interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.AUTHOR_1({
            name: _client.user.globalName ?? _client.user.username,
          }),
        })
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
                  (process.memoryUsage().heapUsed / 1024 / 1024) * 100
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
                0
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
