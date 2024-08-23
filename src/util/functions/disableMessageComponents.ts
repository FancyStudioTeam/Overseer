import type { Message } from "oceanic.js";
import { client } from "#index";

export const disableMessageComponents = async (message: Message) => {
  for (const row of message.components) {
    for (const component of row.components) {
      component.disabled = true;
    }
  }

  await client.rest.channels.editMessage(message.channelID, message.id, {
    components: message.components,
  });
};
