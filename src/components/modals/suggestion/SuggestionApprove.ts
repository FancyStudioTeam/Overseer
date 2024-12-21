import { Emojis } from "@constants";
import { Translations } from "@translations";
import { createModalComponent } from "@util/Handlers";
import { checkBitField, createErrorMessage, disableMessageComponents } from "@util/utils";
import { noop } from "es-toolkit";
import { EmbedBuilder, EmbedFieldBuilder } from "oceanic-builders";
import { MessageFlags } from "oceanic.js";

export default createModalComponent({
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  name: "@suggestion/approve",
  run: async ({ client, context, locale }) => {
    await context.deferUpdate().catch(noop);

    const originalEphemeralMessage = context.message;
    const originalMessageId = originalEphemeralMessage?.messageReference?.messageID ?? "";
    const originalMessage = await client.rest.channels.getMessage(context.channelID, originalMessageId);
    const userSuggestion = await client.prisma.userSuggestion.findUnique({
      select: {
        suggestionId: true,
      },
      where: {
        guildId: context.guildID,
        messageId: originalMessage.id,
      },
    });

    if (!userSuggestion) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.SUGGESTION_NOT_FOUND,
      );
    }

    await client.prisma.userSuggestion.delete({
      where: {
        suggestionId: userSuggestion.suggestionId,
      },
    });

    const reason = context.data.components.getTextInput("reason", true);
    const hasSuppressEmbedsFlag = checkBitField(originalMessage.flags, MessageFlags.SUPPRESS_EMBEDS);
    const suggestionEmbed = originalMessage.embeds[0];

    if (!hasSuppressEmbedsFlag && suggestionEmbed) {
      await disableMessageComponents(
        originalMessage,
        new EmbedBuilder(suggestionEmbed)
          .addFields([
            new EmbedFieldBuilder()
              .setName(
                Translations[locale].COMMANDS.UTILITY.SUGGESTION.MESSAGE_1.FIELD_2.NAME({
                  moderatorName: context.user.name,
                }),
              )
              .setValue(`${Emojis.ARROW_CIRCLE_RIGHT} ${reason}`),
          ])
          .toJSON(),
      );
    }

    return;
  },
});
