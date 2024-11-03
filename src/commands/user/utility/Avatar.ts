import { Colors } from "@constants";
import { createUserCommand } from "@util/Handlers";
import { createMessage } from "@utils";
import { Embed } from "oceanic-builders";
import { ApplicationCommandTypes, ApplicationIntegrationTypes, InteractionContextTypes } from "oceanic.js";

export default createUserCommand({
  contexts: [InteractionContextTypes.GUILD],
  integrationTypes: [ApplicationIntegrationTypes.GUILD_INSTALL],
  name: "Avatar",
  type: ApplicationCommandTypes.USER,
  run: async ({ context }) => {
    const userOption = context.data.target;

    await createMessage(context, new Embed().setImage(userOption.avatarURL()).setColor(Colors.COLOR).toJSON());
  },
});
