import { Embed } from "oceanic-builders";
import { Colors } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { createChatInputSubCommand } from "#util/Handlers.js";

export default createChatInputSubCommand({
  name: "debug",
  run: async ({ context, locale }) =>
    await context.reply({
      embeds: new Embed()
        .setTitle(Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.TITLE_1)
        .setDescription(
          Translations[locale].COMMANDS.INFORMATION.DEBUG.MESSAGE_1.DESCRIPTION_1({
            guilds: client.guilds.size,
            users: client.guilds.reduce((previousCount, guild) => previousCount + guild.memberCount, 0),
          }),
        )
        .setColor(Colors.COLOR)
        .toJSON(true),
    }),
});
