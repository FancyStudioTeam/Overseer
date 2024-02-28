import humanize from "humanize-duration";
import type { CommandInteraction } from "oceanic.js";
import { dependencies, devDependencies } from "../../../../../package.json";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { translations } from "../../../../locales/translations";

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
            name: translations[locale].COMMANDS.INFO.BOT.MESSAGE.FIELD_1,
            value: translations[locale].COMMANDS.INFO.BOT.MESSAGE.VALUE_1({
              uptime: humanize(client._uptime, {
                language: locale,
                largest: 2,
                round: true,
              }),
            }),
          },
          {
            name: translations[locale].COMMANDS.INFO.BOT.MESSAGE.FIELD_2,
            value: translations[locale].COMMANDS.INFO.BOT.MESSAGE.VALUE_2({
              users: client.guilds.reduce((a, b) => a + b.memberCount, 0),
              guilds: client.guilds.size,
              shards: client.shards.size,
            }),
          },
          {
            name: translations[locale].COMMANDS.INFO.BOT.MESSAGE.FIELD_3,
            value: translations[locale].COMMANDS.INFO.BOT.MESSAGE.VALUE_3({
              library: `[Oceanic ${dependencies["oceanic.js"]}](https://oceanic.ws/)`,
              language: `[TypeScript ${devDependencies.typescript}](https://www.typescriptlang.org/)`,
              memory: formatBytes(process.memoryUsage().heapUsed),
            }),
          },
        ])
        .setColor(client.config.colors.COLOR)
        .toJSONArray(),
    });

    function formatBytes(data: number): string {
      return `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
    }
  },
});
