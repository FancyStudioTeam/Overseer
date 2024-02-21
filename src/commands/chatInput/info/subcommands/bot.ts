import humanize from "humanize-duration";
import type { CommandInteraction } from "oceanic.js";
import pkg from "../../../../../package.json";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";

export default new SubCommand({
  name: "bot",
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language }
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
            name: client.locales.__({
              phrase: "commands.information.bot.message.field",
              locale: language,
            }),
            value: client.locales.__mf(
              {
                phrase: "commands.information.bot.message.value",
                locale: language,
              },
              {
                version: pkg.version,
                uptime: humanize(client._uptime, {
                  round: true,
                  largest: 2,
                  language: language,
                }),
              }
            ),
          },
          {
            name: client.locales.__({
              phrase: "commands.information.bot.message.field2",
              locale: language,
            }),
            value: client.locales.__mf(
              {
                phrase: "commands.information.bot.message.value2",
                locale: language,
              },
              {
                users: client.guilds.reduce((a, b) => a + b.memberCount, 0),
                guilds: client.guilds.size,
                shards: client.shards.size,
              }
            ),
          },
          {
            name: client.locales.__({
              phrase: "commands.information.bot.message.field3",
              locale: language,
            }),
            value: client.locales.__mf(
              {
                phrase: "commands.information.bot.message.value3",
                locale: language,
              },
              {
                library: `[Oceanic ${pkg.dependencies["oceanic.js"]}](https://oceanic.ws/)`,
                language: `[TypeScript ${pkg.devDependencies.typescript}](https://www.typescriptlang.org/)`,
                ram: formatBytes(process.memoryUsage().heapUsed),
                platform: process.platform,
              }
            ),
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });

    function formatBytes(data: number): string {
      return `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;
    }
  },
});
