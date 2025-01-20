import { type DiscordEmbed, MessageFlags } from "@discordeno/bot";
import type { AnyMessagePayload, MessagePayload } from "@types";
import { DEFAULT_EMBED_COLOR } from "@util/constants.js";

const isEmbedObject = (content: AnyMessagePayloadWithObjects): content is DiscordEmbed => "description" in content;
const isMessagePayload = (content: AnyMessagePayloadWithObjects): content is MessagePayload =>
  "components" in content || "content" in content || "embeds" in content || "files" in content || "flags" in content;

/**
 * Resolves a message payload into a valid Discord message payload object.
 * @param content Any kind of message payload.
 * @param options The available options.
 * @returns The resolved message payload.
 */
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

  /**
   * If the content is a string, treat is as an embed object with a description.
   */
  if (typeof content === "string") {
    messagePayload.embeds = [
      {
        description: content,
        color: DEFAULT_EMBED_COLOR,
      },
    ];
  }

  /**
   * If the content is an object, checks whether the object is a message payload or an embed object.
   */
  if (typeof content === "object") {
    if (isMessagePayload(content)) {
      messagePayload = {
        ...messagePayload,
        ...content,
      };
    } else if (isEmbedObject(content)) {
      messagePayload.embeds = [
        {
          ...content,
          color: DEFAULT_EMBED_COLOR,
        },
      ];
    } else {
      throw new Error("Invalid message payload.");
    }
  }

  return messagePayload;
};

interface ResolveMessagePayloadOptions {
  isEphemeral?: boolean;
}

type AnyMessagePayloadWithObjects = Exclude<AnyMessagePayload, string>;
