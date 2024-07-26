import { Embed } from "oceanic-builders";
import type { CommandInteraction } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import { type ChatInputSubCommand, Directories } from "#types";

export default new Base<ChatInputSubCommand>({
  name: "avatar",
  directory: Directories.UTILITY,
  run: async (context: CommandInteraction) => {
    const _userOption = context.data.options.getUser("user") ?? context.user;

    await context.reply({
      embeds: new Embed().setImage(_userOption.avatarURL()).setColor(Colors.COLOR).toJSON(true),
    });
  },
});
