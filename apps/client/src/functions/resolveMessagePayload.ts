import { type DiscordEmbed, MessageFlags, snakelize } from "@discordeno/bot";
import { DEFAULT_EMBED_COLOR } from "@util/constants.js";
import type { AnyMessagePayload, MessagePayload } from "@util/types.js";

/**
 * Checks whether the content is a valid message payload object.
 * @param content - Any message payload with objects.
 * @returns The valid message payload object or "false".
 */
const isMessagePayload = (content: AnyMessagePayloadWithObjects): content is MessagePayload =>
  "components" in content || "content" in content || "embeds" in content || "files" in content || "flags" in content;

/**
 * Resolves any message payload kind into a valid Discord message payload object.
 * @param content - Any message payload kind.
 * @param options - The available options.
 * @returns The resolved message payload object.
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
   * Otherwise, treat it as a message payload object or an embed object.
   */
  if (typeof content === "string") {
    messagePayload.embeds = [
      {
        description: content,
        color: DEFAULT_EMBED_COLOR,
      },
    ];
  } else if (typeof content === "object") {
    /** Check whether the object is a message payload and handle as it is. */
    if (isMessagePayload(content)) {
      /** Merge the message payload with the new content. */
      messagePayload = {
        ...messagePayload,
        ...content,
      };
    } else {
      messagePayload.embeds = [
        {
          /** Merge the embed properties with the current embed. */
          ...(snakelize(content) as DiscordEmbed),
          color: DEFAULT_EMBED_COLOR,
        },
      ];
    }
  }

  return messagePayload;
};

interface ResolveMessagePayloadOptions {
  /** Whether to include the ephemeral flag in the message payload. */
  isEphemeral?: boolean;
}

type AnyMessagePayloadWithObjects = Exclude<AnyMessagePayload, string>;
