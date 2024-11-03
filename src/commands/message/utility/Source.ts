import { createMessageCommand } from "@util/Handlers";
import { createMessage } from "@utils";
import { Attachment } from "oceanic-builders";
import { ApplicationCommandTypes, ApplicationIntegrationTypes, InteractionContextTypes } from "oceanic.js";

export default createMessageCommand({
  contexts: [InteractionContextTypes.GUILD],
  integrationTypes: [ApplicationIntegrationTypes.GUILD_INSTALL],
  name: "Source",
  type: ApplicationCommandTypes.MESSAGE,
  run: async ({ context }) => {
    const messageTarget = context.data.target;
    const messagePayload = JSON.stringify(messageTarget, null, 2);

    await createMessage(context, {
      files: new Attachment().setContents(Buffer.from(messagePayload)).setName("Message.json").toJSON(true),
    });
  },
});
