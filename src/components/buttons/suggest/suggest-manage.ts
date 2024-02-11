import {
  ButtonStyles,
  type ComponentInteraction,
  MessageFlags,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../builders/ActionRow";
import { ButtonBuilder } from "../../../builders/Button";
import { EmbedBuilder } from "../../../builders/Embed";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";

export default new Component({
  name: "suggest-manage",
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language },
  ) => {
    interaction.reply({
      embeds: new EmbedBuilder()
        .setAuthor({
          name: interaction.guild?.name ?? client.user.username,
          iconURL: interaction.guild?.iconURL() ?? client.user.avatarURL(),
        })
        .setDescription(
          client.locales.__mf({
            phrase: "commands.utility.suggest.row.manage.message",
            locale: language,
          }),
        )
        .setColor(client.config.colors.color)
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setCustomID("suggest-manage-votes")
            .setLabel(
              client.locales.__({
                phrase: "commands.utility.suggest.row.manage.row.votes.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1201582477089718302",
            }),
          new ButtonBuilder()
            .setCustomID("suggest-manage-comment")
            .setLabel(
              client.locales.__({
                phrase: "commands.utility.suggest.row.manage.row.comment.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1201582795718393957",
            })
            .setDisabled(!interaction.member?.permissions.has("MANAGE_GUILD")),
          new ButtonBuilder()
            .setCustomID("suggest-manage-approve")
            .setLabel(
              client.locales.__({
                phrase: "commands.utility.suggest.row.manage.row.approve.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1201582315915190312",
            })
            .setDisabled(!interaction.member?.permissions.has("MANAGE_GUILD")),
          new ButtonBuilder()
            .setCustomID("suggest-manage-deny")
            .setLabel(
              client.locales.__({
                phrase: "commands.utility.suggest.row.manage.row.deny.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1201581407290531890",
            })
            .setDisabled(!interaction.member?.permissions.has("MANAGE_GUILD")),
        ])
        .toJSONArray(),
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
