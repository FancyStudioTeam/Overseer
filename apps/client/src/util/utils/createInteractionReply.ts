import { type InteractionCallbackData, InteractionResponseTypes } from "@discordeno/bot";
import { client } from "@index";

export const createInteractionReply = async (
  context: typeof client.transformers.$inferredTypes.interaction,
  content: Pick<InteractionCallbackData, "allowedMentions" | "components" | "content" | "embeds" | "flags" | "poll">,
) =>
  context.acknowledged
    ? await client.rest.sendFollowupMessage(context.token, content)
    : await client.rest.sendInteractionResponse(context.id, context.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: content,
      });
