import { Embed } from "oceanic-builders";
import { type AnyInteractionGateway, type Message, MessageFlags } from "oceanic.js";
import { Colors } from "#constants";
import { createMessage } from "./createMessage";

export const errorMessage = async (
  content: string,
  {
    context,
    shouldBeEphemeral = true,
  }: {
    context: AnyInteractionGateway | Message;
    shouldBeEphemeral?: boolean;
  },
) =>
  await createMessage(context, {
    embeds: new Embed().setDescription(content).setColor(Colors.RED).toJSON(true),
    flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
  });
