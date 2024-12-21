import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage } from "@util/utils";
import { ModalBuilder, TextInputBuilder } from "oceanic-builders";
import { TextInputStyles } from "oceanic.js";

export default createButtonComponent({
  name: "@suggestion/approve",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, locale }) => {
    const originalMessageId = context.message.messageReference?.messageID ?? "";
    const userSuggestion = await client.prisma.userSuggestion.findUnique({
      select: {
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

    return await context.createModal(
      new ModalBuilder()
        .setCustomID("@suggestion/approve")
        .setTitle(
          Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.APPROVE.MODAL
            .TITLE,
        )
        .addComponents([
          new TextInputBuilder()
            .setCustomID("reason")
            .setLabel(
              Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.APPROVE
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
