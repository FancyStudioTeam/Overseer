import { Embed } from "oceanic-builders";
import { ApplicationCommandTypes, type User } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import type { UserCommand } from "#types";

export default new Base<UserCommand>({
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async ({ context }) => {
    const userOption = <User>context.data.target;

    await context.reply({
      embeds: new Embed().setImage(userOption.avatarURL()).setColor(Colors.COLOR).toJSON(true),
    });
  },
});
