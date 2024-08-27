import { Embed } from "oceanic-builders";
import { Colors } from "#constants";
import { client } from "#index";
import { createPrefixCommand } from "#util/Handlers";

export default createPrefixCommand({
  name: "test",
  run: async ({ context }) => {
    await client.rest.channels.createMessage(context.channelID, {
      embeds: new Embed().setDescription("Hello World!").setColor(Colors.GREEN).toJSON(true),
    });
  },
});
