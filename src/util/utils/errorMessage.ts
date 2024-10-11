import { Colors } from "@constants";
import { Embed } from "oceanic-builders";
import { type AnyInteractionGateway, type EmbedOptions, type Message, MessageFlags } from "oceanic.js";
import { createMessage } from "./createMessage.js";

export const errorMessage = async (
  content: string | EmbedOptions,
  {
    context,
    shouldBeEphemeral = true,
  }: {
    context: AnyInteractionGateway | Message;
    shouldBeEphemeral?: boolean;
  },
) =>
  await createMessage(context, {
    embeds:
      typeof content === "string"
        ? new Embed().setDescription(content).setColor(Colors.COLOR).toJSON(true)
        : new Embed(content).setColor(Colors.COLOR).toJSON(true),
    flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
  });
