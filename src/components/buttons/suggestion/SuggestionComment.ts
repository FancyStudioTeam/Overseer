import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage } from "@util/utils";
import { ModalBuilder, TextInputBuilder } from "oceanic-builders";
import { TextInputStyles } from "oceanic.js";

export default createButtonComponent({
  name: "@suggestion/comment",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, locale }) => {
    const originalMessageId = context.message.messageReference?.messageID ?? "";
    const userSuggestion = await client.prisma.userSuggestion.findUnique({
      select: {
        comments: true,
        suggestionId: true,
      },
      where: {
        guildId: context.guildID,
        messageId: originalMessageId,
      },
    });

    if (!userSuggestion) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.SUGGESTION_NOT_FOUND,
      );
    }

    if (userSuggestion.comments.length >= 5) {
      return await createErrorMessage(
        context,
        Translations[
          locale
        ].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.COMMENT.MAXIMUM_COMMENTS_ALLOWED({
          maximum: 5,
        }),
      );
    }

    return await context.createModal(
      new ModalBuilder()
        .setCustomID("@suggestion/comment")
        .setTitle(
          Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.COMMENT.MODAL
            .TITLE,
        )
        .addComponents([
          new TextInputBuilder()
            .setCustomID("comment")
            .setLabel(
              Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.COMMENT
                .MODAL.INPUT_1.LABEL,
            )
            .setStyle(TextInputStyles.SHORT)
            .setMinLength(5)
            .setMaxLength(100)
            .setRequired(true),
        ])
        .toJSON(),
    );
  },
});
