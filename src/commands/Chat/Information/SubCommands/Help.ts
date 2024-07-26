import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import { Translations } from "#translations";
import { type ChatInputSubCommand, Directories } from "#types";

export default new Base<ChatInputSubCommand>({
  name: "help",
  directory: Directories.INFORMATION,
  run: async (context: CommandInteraction, { locale }) => {
    await context.reply({
      embeds: new Embed()
        .setDescription(Translations[locale].COMMANDS.INFORMATION.HELP.MESSAGE_1.DESCRIPTION_1)
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
