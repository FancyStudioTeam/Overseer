import { EmbedBuilder } from "oceanic-builders";
import { ApplicationCommandTypes, type CommandInteraction, type User } from "oceanic.js";
import { BaseBuilder } from "#base";
import type { Discord } from "#client";
import { Colors } from "#constants";
import type { UserCommandInterface } from "#types";

export default new BaseBuilder<UserCommandInterface>({
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async (_client: Discord, _context: CommandInteraction) => {
    const _userOption = <User>_context.data.target;

    await _context.reply({
      embeds: new EmbedBuilder().setImage(_userOption.avatarURL()).setColor(Colors.COLOR).toJSONArray(),
    });
  },
});
