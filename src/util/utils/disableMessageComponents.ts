import { client } from "@index";
import type { AnyMessagePayload } from "@types";
import type { Message } from "oceanic.js";
import { resolveMessagePayload } from "./resolveMessagePayload.js";

export const disableMessageComponents = async (message: Message, content?: AnyMessagePayload) => {
  for (const row of message.components) {
    for (const component of row.components) {
      component.disabled = true;
    }
  }

  const resolvedMessagePayload = resolveMessagePayload(content ?? {});

  await client.rest.channels.editMessage(message.channelID, message.id, {
    ...resolvedMessagePayload,
    components: message.components,
  });
};
