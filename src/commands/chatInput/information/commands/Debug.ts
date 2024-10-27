import { Colors } from "@constants";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { Embed } from "oceanic-builders";

export default createChatInputSubCommand({
  category: CommandCategory.INFORMATION,
  name: "debug",
  run: async ({ client, context, locale }) =>
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
