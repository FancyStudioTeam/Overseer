import { Colors } from "@constants";
import { author as developer, version } from "@package";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { pagination } from "@util/Pagination";
import { Embed, EmbedField } from "oceanic-builders";

const bytesToMegaBytes = (bytes: number) => bytes / 1000000;

export default createChatInputSubCommand({
  category: CommandCategory.INFORMATION,
  name: "debug",
  run: async ({ client, context, locale }) => {
    const { totalMemory, usedMemory } = {
      totalMemory: Math.round(bytesToMegaBytes(process.memoryUsage().heapTotal)),
      usedMemory: Math.round(bytesToMegaBytes(process.memoryUsage().heapUsed)),
    };
    const availablePaginationPages = [
      new Embed()
        .setTitle(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.TITLE_1)
        .addFields([
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_1.NAME).setValue(
            Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_1.VALUE({
              version,
              developer,
            }),
          ),
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_2.NAME).setValue(
            Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_2.VALUE({
              guildCount: client.guilds.size,
              shardCount: client.shards.size,
              userCount: client.guilds.reduce((previousCount, guild) => previousCount + guild.memberCount, 0),
            }),
          ),
          new EmbedField().setName(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_3.NAME).setValue(
            Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_3.VALUE({
              lastResetDate: client.readyAt,
            }),
          ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(),
      new Embed()
        .setTitle(Translations[locale].COMMANDS.INFORMATION.DEBUG.COMPONENTS.BUTTONS.PROCESS.MESSAGE_1.TITLE_1)
        .addFields([
          new EmbedField()
            .setName(Translations[locale].COMMANDS.INFORMATION.DEBUG.COMPONENTS.BUTTONS.PROCESS.MESSAGE_1.FIELD_1.NAME)
            .setValue(
              Translations[locale].COMMANDS.INFORMATION.DEBUG.COMPONENTS.BUTTONS.PROCESS.MESSAGE_1.FIELD_1.VALUE({
                totalMemory,
                usedMemory,
              }),
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(),
    ];

    pagination(context, {
      data: availablePaginationPages,
      locale,
      timeBeforeExpiration: 60000,
    });
  },
});
