import { Colors } from "@constants";
import { EmbedBuilder } from "oceanic-builders";
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
    messagePayload.embeds = new EmbedBuilder().setDescription(content).setColor(Colors.COLOR).toJSON(true);
  }

  if (typeof content === "object") {
    if (
      "components" in content ||
      "content" in content ||
      "embeds" in content ||
      "files" in content ||
      "flags" in content
    ) {
      messagePayload = {
        ...messagePayload,
        ...content,
      };
    } else {
      messagePayload.embeds = new EmbedBuilder(content as EmbedOptions).setColor(Colors.COLOR).toJSON(true);
    }
  }

  return await createReplyOrMessage(context, messagePayload);
};
