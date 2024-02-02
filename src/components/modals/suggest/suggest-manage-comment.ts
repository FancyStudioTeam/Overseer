import { MessageFlags, ModalSubmitInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Modal } from "../../../classes/Builders";
import { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Modal({
  name: "suggest-manage-comment",
  run: async (
    client: Fancycord,
    interaction: ModalSubmitInteraction,
    { language },
  ) => {
    await interaction.deferUpdate().catch(() => null);

    const userSuggestion = await prisma.userSuggestion.findUnique({
      where: {
        message_id: interaction.message?.messageReference?.messageID,
      },
    });

    if (!userSuggestion) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.utility.suggest.suggestion-not-found",
          locale: language,
        }),
      });
    }

    if (userSuggestion.comments.length >= 3) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase:
            "commands.utility.suggest.row.manage.row.comment.max-comments-allowed",
          locale: language,
        }),
      });
    }

    const comment = interaction.data.components.getTextInput(
      "suggest-manage-comment-comment",
      true,
    );
    const message = await client.rest.channels
      .getMessage(interaction.channelID, userSuggestion.message_id)
      .catch(() => null);

    if (
      message?.flags !== MessageFlags.SUPPRESS_EMBEDS &&
      message?.embeds.length
    ) {
      new EmbedBuilder()
        .load(message.embeds[0])
        .addField({
          name: client.locales.__mf(
            {
              phrase: "commands.utility.suggest.message.field",
              locale: language,
            },
            {
              user: interaction.user.username,
            },
          ),
          value: `<:_:1201948012830531644> ${comment}`,
        })
        .setColor(client.config.colors.warning);

      await message.edit({
        embeds: message.embeds,
      });
    }

    await prisma.userSuggestion.update({
      where: {
        message_id: userSuggestion.message_id,
      },
      data: {
        comments: {
          push: comment,
        },
      },
    });
  },
});
