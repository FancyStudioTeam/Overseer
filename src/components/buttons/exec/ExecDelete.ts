import { createButtonComponent } from "@util/Handlers";
import { ComponentTypes } from "oceanic.js";

export default createButtonComponent({
  developerOnly: true,
  name: "@exec/delete",
  type: ComponentTypes.BUTTON,
  run: async ({ client, context }) => {
    await client.rest.channels.deleteMessage(context.channelID, context.message.id);
  },
});
