import { Colors } from "@constants";
import { Embed } from "oceanic-builders";
import {
  type AnyInteractionGateway,
  type CreateMessageOptions,
  type EmbedOptions,
  type Message,
  MessageFlags,
} from "oceanic.js";
import { createReplyOrMessage } from "./createReplyOrMessage.js";

export const createMessage = async (
  context: AnyInteractionGateway | Message,
  content: string | EmbedOptions | CreateMessageOptions,
  {
    shouldBeEphemeral = true,
  }: {
    shouldBeEphemeral?: boolean;
  } = {},
) => {
  let messagePayload: CreateMessageOptions = {
    flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  if (typeof content === "string") {
    messagePayload.embeds = new Embed().setDescription(content).setColor(Colors.COLOR).toJSON(true);
  }

  if (typeof content === "object") {
    if ("content" in content || "embeds" in content || "components" in content || "flags" in content) {
      messagePayload = {
        ...messagePayload,
        ...content,
      };
    } else {
      messagePayload.embeds = new Embed(content as EmbedOptions).setColor(Colors.COLOR).toJSON(true);
    }
  }

  return await createReplyOrMessage(context, messagePayload);
};
