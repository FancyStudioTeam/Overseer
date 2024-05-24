import type { ButtonComponent, ComponentInteraction } from "oceanic.js";
import { ButtonBuilder } from "../../../builders/Button";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Component({
  name: "suggest-downvote",
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language },
  ) => {
    await interaction.deferUpdate().catch(() => null);

    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
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
        message_id: interaction.message.id,
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

    const upvotes = userSuggestion.votes_up;
    const neutral = userSuggestion.votes_neutral;
    const downvotes = userSuggestion.votes_down;

    if (downvotes.includes(interaction.user.id)) {
      downvotes.splice(downvotes.indexOf(interaction.user.id), 1);
    } else if (upvotes.includes(interaction.user.id)) {
      upvotes.splice(upvotes.indexOf(interaction.user.id), 1);
      downvotes.unshift(interaction.user.id);
    } else if (neutral.includes(interaction.user.id)) {
      neutral.splice(neutral.indexOf(interaction.user.id), 1);
      downvotes.unshift(interaction.user.id);
    } else {
      downvotes.unshift(interaction.user.id);
    }

    await prisma.userSuggestion
      .update({
        where: {
          message_id: interaction.message.id,
        },
        data: {
          votes_up: upvotes,
          votes_neutral: neutral,
          votes_down: downvotes,
        },
      })
      .then(async (newSchema) => {
        new ButtonBuilder()
          .load(
            <ButtonComponent>interaction.message.components[0].components[0],
          )
          .setLabel(newSchema.votes_up.length.toString());
        new ButtonBuilder()
          .load(
            <ButtonComponent>interaction.message.components[0].components[1],
          )
          .setLabel(newSchema.votes_down.length.toString());

        await client.rest.channels
          .editMessage(interaction.channelID, interaction.message.id, {
            components: interaction.message.components,
          })
          .catch(() => null);
      });
  },
});
