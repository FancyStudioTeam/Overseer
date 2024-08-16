import { Embed } from "oceanic-builders";
import { ApplicationCommandTypes, ApplicationIntegrationTypes, InteractionContextTypes, type User } from "oceanic.js";
import { Colors } from "#constants";
import { createUserCommand } from "#util/Handlers";

export default createUserCommand({
  contexts: [InteractionContextTypes.GUILD],
  integrationTypes: [ApplicationIntegrationTypes.GUILD_INSTALL],
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async ({ context }) => {
    const userOption = context.data.target as User;

    await context.reply({
      embeds: new Embed().setImage(userOption.avatarURL()).setTimestamp().setColor(Colors.COLOR).toJSON(true),
    });
  },
});
