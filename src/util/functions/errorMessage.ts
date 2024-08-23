import { Embed } from "oceanic-builders";
import {
  type AnyInteractionGateway,
  type CreateMessageOptions,
  type InteractionContent,
  type Message,
  MessageFlags,
} from "oceanic.js";
import { Colors } from "#constants";
import { createMessage } from "./createMessage";

export const errorMessage = async ({
  context,
  message,
  shouldBeEphemeral = true,
}: {
  context: AnyInteractionGateway | Message;
  message: string;
  shouldBeEphemeral?: boolean;
}) => {
  const messagePayload: CreateMessageOptions & InteractionContent = {
    embeds: new Embed().setDescription(message).setColor(Colors.RED).toJSON(true),
    flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
  };

  await createMessage(context, messagePayload);
};
