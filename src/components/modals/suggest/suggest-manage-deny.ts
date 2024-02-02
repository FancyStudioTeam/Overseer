import { Member, MessageFlags, ModalSubmitInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Modal } from "../../../classes/Builders";
import { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage, sleep } from "../../../util/util";

export default new Modal({
  name: "suggest-manage-deny",
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
    const guildSuggestion = await prisma.guildSuggestion.findUnique({
      where: {
        guild_id: interaction.guild?.id,
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
      "suggest-manage-deny-reason",
      true,
    );
    const message = await client.rest.channels
      .getMessage(interaction.channelID, userSuggestion.message_id)
      .catch(() => null);

    if (
      message?.flags !== MessageFlags.SUPPRESS_EMBEDS &&
      message?.embeds.length
    ) {
      message.components.forEach((r, _) => {
        r.components.forEach((c, _) => {
          c.disabled = true;
        });
      });

      new EmbedBuilder()
        .load(message.embeds[0])
        .addField({
          name: client.locales.__mf(
            {
              phrase: "commands.utility.suggest.message.field3",
              locale: language,
            },
            {
              user: interaction.user.username,
            },
          ),
          value: `<:_:1201948012830531644> ${reason}`,
        })
        .setColor(client.config.colors.error);

      await message
        .edit({
          embeds: message.embeds,
          components: message.components,
        })
        .then(async () => {
          if (
            guildSuggestion?.threads &&
            message.thread &&
            message.thread.ownerID === client.user.id &&
            message.thread
              .permissionsOf(interaction.guild?.clientMember as Member)
              .has("MANAGE_CHANNELS")
          ) {
            await sleep(1500);
            await client.rest.channels
              .edit(userSuggestion.message_id, {
                name: `[Denied] ${message.thread.name}`,
                locked: true,
                reason: `${interaction.user.username} has denied the suggestion`,
              })
              .catch(() => null);
          }
        });
    }

    await prisma.userSuggestion.delete({
      where: {
        message_id: userSuggestion.message_id,
      },
    });
  },
});
