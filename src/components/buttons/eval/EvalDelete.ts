import { createButtonComponent } from "@util/Handlers";

export default createButtonComponent({
  developerOnly: true,
  name: "@eval/delete",
  run: async ({ client, context }) => {
    await client.rest.channels.deleteMessage(context.channelID, context.message.id);
  },
});
