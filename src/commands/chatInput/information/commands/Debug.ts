import { Colors } from "@constants";
import { author as developer, version } from "@package";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { Pagination } from "@util/Pagination";
import { EmbedBuilder, EmbedFieldBuilder } from "oceanic-builders";

const bytesToMegaBytes = (bytes: number) => bytes / 1000000;

export default createChatInputSubCommand({
  category: CommandCategory.INFORMATION,
  name: "debug",
  run: async ({ client, context, locale }) => {
    const { totalMemory, usedMemory } = {
      totalMemory: Math.round(bytesToMegaBytes(process.memoryUsage().heapTotal)),
      usedMemory: Math.round(bytesToMegaBytes(process.memoryUsage().heapUsed)),
    };
    const availableDebugPages = [
      new EmbedBuilder()
        .setTitle(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.TITLE_1)
        .addFields([
          new EmbedFieldBuilder()
            .setName(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_1.NAME)
            .setValue(
              Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_1.VALUE({
                version,
                developer,
              }),
            ),
          new EmbedFieldBuilder()
            .setName(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_2.NAME)
            .setValue(
              Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_2.VALUE({
                guildCount: client.guilds.size,
                shardCount: client.shards.size,
                userCount: client.guilds.reduce((previousCount, guild) => previousCount + guild.memberCount, 0),
              }),
            ),
          new EmbedFieldBuilder()
            .setName(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_3.NAME)
            .setValue(
              Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.FIELD_3.VALUE({
                lastResetDate: client.readyAt,
              }),
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(),
      new EmbedBuilder()
        .setTitle(Translations[locale].COMMANDS.INFORMATION.DEBUG.COMPONENTS.BUTTONS.PROCESS.MESSAGE_1.TITLE_1)
        .addFields([
          new EmbedFieldBuilder()
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

    return new Pagination(context, {
      locale,
      pages: availableDebugPages,
    });
  },
});
