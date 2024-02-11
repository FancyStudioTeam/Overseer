import { MessageFlags, ModalSubmitInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Modal } from "../../../classes/Builders";
import { Fancycord } from "../../../classes/Client";
import { WebhookType } from "../../../types";
import { prisma } from "../../../util/db";
import { errorMessage, fetchUser, trim, webhook } from "../../../util/util";

export default new Modal({
  name: "suggest-report",
  run: async (
    client: Fancycord,
    interaction: ModalSubmitInteraction,
    { language },
  ) => {
    await interaction.deferUpdate().catch(() => null);

    const userSuggestion = await prisma.userSuggestion.findUnique({
      where: {
        message_id: interaction.message?.id,
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

    const reason = interaction.data.components.getTextInput(
      "suggest-report-reason",
    );
    const user = await fetchUser(userSuggestion.user_id);

    webhook(WebhookType.Reports, {
      embeds: new EmbedBuilder()
        .setAuthor({
          name: user?.username ?? client.user.username,
          iconURL: user?.avatarURL() ?? client.user.avatarURL(),
        })
        .setDescription(
          `\`\`\`json\n${trim(
            JSON.stringify(interaction.message?.embeds, null, 2),
            4000,
          )}\`\`\``,
        )
        .addFields([
          {
            name: "**General information**",
            value: `<:_:1201948012830531644> **User**: ${
              interaction.user.username
            }\n<:_:1201948012830531644> **User ID**: ${
              interaction.user.id
            }\n<:_:1201948012830531644> **Reported User**: ${
              user?.username ?? "<:_:1201586248947597392>"
            }\n<:_:1201948012830531644> **Reported User ID**: ${
              userSuggestion.user_id
            }\n<:_:1201948012830531644> **Reason**: ${reason}`,
          },
        ])
        .setColor(client.config.colors.color)
        .toJSONArray(),
    });

    interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          client.locales.__({
            phrase: "commands.utility.suggest.row.report.message",
            locale: language,
          }),
        )
        .setColor(client.config.colors.success)
        .toJSONArray(),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
