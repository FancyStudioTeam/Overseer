import { Embed } from "oceanic-builders";
import { ApplicationCommandTypes, ApplicationIntegrationTypes, InteractionContextTypes, type User } from "oceanic.js";
import { Base } from "#base";
import { Colors } from "#constants";
import type { UserCommand } from "#types";

export default new Base<UserCommand>({
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  contexts: [InteractionContextTypes.GUILD],
  integrationTypes: [ApplicationIntegrationTypes.GUILD_INSTALL],
  run: async ({ context }) => {
    const userOption = context.data.target as User;

    await context.reply({
      embeds: new Embed().setImage(userOption.avatarURL()).setTimestamp().setColor(Colors.COLOR).toJSON(true),
    });
  },
});
