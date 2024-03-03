import humanize from "humanize-duration";
import type { CommandInteraction } from "oceanic.js";
import { version } from "../../../../../package.json";
import { dependencies, devDependencies } from "../../../../../package.json";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { Colors } from "../../../../constants";
import { Translations } from "../../../../locales/index";

export default new SubCommand({
  name: "bot",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { locale }
  ) => {
    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setThumbnail(client.user.avatarURL())
        .addFields([
          {
            name: Translations[locale].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_1
              .FIELD,
            value: Translations[
              locale
            ].COMMANDS.INFO.BOT.MESSAGE_1.FIELD_1.VALUE({
              version,
              uptime: humanize(client._uptime, {
                language: locale.toLowerCase(),
                largest: 2,
                round: true,
                fallbacks: ["en"],
              }),
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
              library: `[Oceanic ${dependencies["oceanic.js"]}](https://oceanic.ws/)`,
              language: `[TypeScript ${devDependencies.typescript}](https://www.typescriptlang.org/)`,
              memory: formatBytes(process.memoryUsage().heapUsed),
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
