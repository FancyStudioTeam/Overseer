import { Colors } from "@constants";
import type { AnyMessagePayload, MessagePayload } from "@types";
import { EmbedBuilder } from "oceanic-builders";
import { type EmbedOptions, MessageFlags } from "oceanic.js";

export const resolveMessagePayload = (
  content: AnyMessagePayload,
  {
    shouldBeEphemeral = true,
  }: {
    shouldBeEphemeral?: boolean;
  } = {},
) => {
  let messagePayload: MessagePayload = {
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

  return messagePayload;
};
