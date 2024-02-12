import { MessageFlags, ModalSubmitInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Modal } from "../../../classes/Builders";
import { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { bitFieldValues, errorMessage } from "../../../util/util";

export default new Modal({
  name: "suggest-manage-comment",
  run: async (
    client: Fancycord,
    interaction: ModalSubmitInteraction,
    { language },
  ) => {
    await interaction.deferUpdate().catch(() => null);

    if (!interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    const userSuggestion = await prisma.userSuggestion.findUnique({
      where: {
        guild_id: interaction.guild.id,
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
      message &&
      !bitFieldValues(message.flags).some(
        (f) => f === MessageFlags.SUPPRESS_EMBEDS,
      )
    ) {
      await client.rest.channels
        .editMessage(message.channelID, message.id, {
          embeds: new EmbedBuilder()
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
            .setColor(client.config.colors.warning)
            .toJSONArray(),
        })
        .catch(() => null);
    }

    await prisma.userSuggestion.update({
      where: {
        guild_id: userSuggestion.guild_id,
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
