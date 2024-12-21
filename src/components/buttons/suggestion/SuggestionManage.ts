import { Colors, Emojis } from "@constants";
import { Translations } from "@translations";
import { createButtonComponent } from "@util/Handlers";
import { createErrorMessage, createMessage } from "@util/utils";
import { noop } from "es-toolkit";
import { ActionRowBuilder, EmbedBuilder, EmbedFieldBuilder, SecondaryButtonBuilder } from "oceanic-builders";

export default createButtonComponent({
  name: "@suggestion/manage",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, locale }) => {
    await context.deferUpdate().catch(noop);

    const userSuggestion = await client.prisma.userSuggestion.findUnique({
      select: {
        comments: true,
        suggestionId: true,
      },
      where: {
        guildId: context.guildID,
        messageId: context.message.id,
      },
    });

    if (!userSuggestion) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.SUGGESTION_NOT_FOUND({
          dataId: context.message.id,
        }),
      );
    }

    return await createMessage(context, {
      components: new ActionRowBuilder()
        .addComponents([
          new SecondaryButtonBuilder()
            .setCustomID("@suggestion/comment")
            .setLabel(
              Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.COMMENT
                .LABEL,
            )
            .setEmoji(Emojis.FORUM)
            .setDisabled(userSuggestion.comments.length >= 5),
          new SecondaryButtonBuilder()
            .setCustomID("@suggestion/approve")
            .setLabel(
              Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.APPROVE
                .LABEL,
            )
            .setEmoji(Emojis.CHECK_CIRCLE),
          new SecondaryButtonBuilder()
            .setCustomID("@suggestion/reject")
            .setLabel(
              Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.COMPONENTS.BUTTONS.REJECT
                .LABEL,
            )
            .setEmoji(Emojis.CANCEL),
        ])
        .toJSON(true),
      embeds: new EmbedBuilder()
        .setTitle(Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.MESSAGE_1.TITLE_1)
        .addFields([
          new EmbedFieldBuilder()
            .setName(Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.MESSAGE_1.FIELD_1.NAME)
            .setValue(
              Translations[locale].COMMANDS.UTILITY.SUGGESTION.COMPONENTS.BUTTONS.MANAGE.MESSAGE_1.FIELD_1.VALUE({
                suggestionId: userSuggestion.suggestionId,
              }),
            ),
        ])
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
