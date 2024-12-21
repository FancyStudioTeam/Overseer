import { Emojis } from "@constants";
import { Translations } from "@translations";
import { createModalComponent } from "@util/Handlers";
import { checkBitField, createErrorMessage } from "@util/utils";
import { noop } from "es-toolkit";
import { EmbedBuilder, EmbedFieldBuilder } from "oceanic-builders";
import { MessageFlags } from "oceanic.js";

export default createModalComponent({
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  name: "@suggestion/comment",
  run: async ({ client, context, locale }) => {
    await context.deferUpdate().catch(noop);

    const originalEphemeralMessage = context.message;
    const originalMessageId = originalEphemeralMessage?.messageReference?.messageID ?? "";
    const originalMessage = await client.rest.channels.getMessage(context.channelID, originalMessageId);
    const userSuggestion = await client.prisma.userSuggestion.findUnique({
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

    const userSuggestionComments = await client.prisma.userSuggestionComment.findMany({
      where: {
        suggestionId: userSuggestion.suggestionId,
      },
    });

    if (userSuggestionComments.length >= 5) {
      return await createErrorMessage(
        context,
        Translations[
          locale
        ].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.COMMENT.MAXIMUM_COMMENTS_ALLOWED({
          maximum: 5,
        }),
      );
    }

    const commentInput = context.data.components.getTextInput("comment", true);

    await client.prisma.$transaction([
      client.prisma.userSuggestionComment.create({
        data: {
          comment: commentInput,
          moderatorId: context.user.id,
          suggestionId: userSuggestion.suggestionId,
        },
      }),
      client.prisma.userSuggestion.update({
        data: {
          lastUpdate: new Date(),
        },
        where: {
          suggestionId: userSuggestion.suggestionId,
        },
      }),
    ]);

    const hasSuppressEmbedsFlag = checkBitField(originalMessage.flags, MessageFlags.SUPPRESS_EMBEDS);
    const suggestionEmbed = originalMessage.embeds[0];

    if (!hasSuppressEmbedsFlag && suggestionEmbed) {
      await client.rest.channels.editMessage(originalMessage.channelID, originalMessage.id, {
        embeds: new EmbedBuilder(suggestionEmbed)
          .addFields([
            new EmbedFieldBuilder()
              .setName(
                Translations[locale].COMMANDS.UTILITY.SUGGESTION.MESSAGE_1.FIELD_1.NAME({
                  moderatorName: context.user.name,
                }),
              )
              .setValue(`${Emojis.ARROW_CIRCLE_RIGHT} ${commentInput}`),
          ])
          .toJSON(true),
      });
    }

    return;
  },
});
