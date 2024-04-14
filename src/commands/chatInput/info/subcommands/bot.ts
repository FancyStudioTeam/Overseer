import humanize from "humanize-duration";
import { type CommandInteraction, VERSION } from "oceanic.js";
import ts from "typescript";
import { version } from "../../../../../package.json";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { Colors, Links } from "../../../../constants";
import { Translations } from "../../../../locales";

export default new SubCommand({
  name: "bot",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { locale }
  ) => {
    interaction.reply({
      embeds: new EmbedBuilder()
        .setTitle(
          Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.TITLE_1({
            name: client.user.username,
          })
        )
        .setURL(Links.SUPPORT)
        .setThumbnail(client.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_1
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_1.VALUE({
              version,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_2
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_2.VALUE({
              users: client.guilds.reduce((a, b) => a + b.memberCount, 0),
              guilds: client.guilds.size,
              shards: client.shards.size,
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_3
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_3.VALUE({
              library: `[Oceanic ${VERSION}](https://oceanic.ws/)`,
              language: `[TypeScript ${ts.version}](https://www.typescriptlang.org/)`,
              memory: formatBytes(process.memoryUsage().heapUsed),
            }),
          },
          {
            name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_4
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_4.VALUE({
              uptime: humanize(client._uptime, {
                language: locale.toLowerCase(),
                largest: 2,
                round: true,
                fallbacks: ["en"],
              }),
            }),
          },
        ])
        .setColor(Colors.COLOR)
        .toJSONArray(),
    });

    function formatBytes(data: number): string {
      return `${Math.round((data / 1024 / 1024) * 100) / 100}mb`;
    }
  },
});
