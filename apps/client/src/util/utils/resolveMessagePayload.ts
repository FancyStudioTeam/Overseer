import { MessageFlags } from "@discordeno/bot";
import type { AnyMessagePayload, MessagePayload } from "@types";
import { DEFAULT_EMBED_COLOR } from "@util/constants.js";

export const resolveMessagePayload = (
  content: AnyMessagePayload,
  options: ResolveMessagePayloadOptions = {
    isEphemeral: false,
  },
): MessagePayload => {
  const { isEphemeral } = options;
  let messagePayload: MessagePayload = {
    flags: isEphemeral ? MessageFlags.Ephemeral : undefined,
  };

  if (typeof content === "string") {
    messagePayload.embeds = [
      {
        description: content,
        color: DEFAULT_EMBED_COLOR,
      },
    ];
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
      messagePayload.embeds = [
        {
          ...content,
          color: DEFAULT_EMBED_COLOR,
        },
      ];
    }
  }

  return messagePayload;
};

interface ResolveMessagePayloadOptions {
  isEphemeral?: boolean;
}
