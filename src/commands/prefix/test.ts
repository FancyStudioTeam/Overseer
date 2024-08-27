import { Embed } from "oceanic-builders";
import type { Message } from "oceanic.js";
import { Colors } from "#constants";

export default async (message: Message) => {
  await message.client.rest.channels.createMessage(message.channelID, {
    embeds: new Embed().setDescription("Test!").setColor(Colors.COLOR).toJSON(true),
  });
};
