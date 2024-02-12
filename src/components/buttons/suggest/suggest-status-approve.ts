import {
  ButtonStyles,
  ChannelTypes,
  type ComponentInteraction,
  type Member,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../builders/ActionRow";
import { ButtonBuilder } from "../../../builders/Button";
import { EmbedBuilder } from "../../../builders/Embed";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage, fetchUser, sleep } from "../../../util/util";

export default new Component({
  name: "suggest-status-approve",
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language, premium },
  ) => {
    const guildSuggestion = await prisma.guildSuggestion.findUnique({
      where: {
        guild_id: interaction.guild?.id,
      },
    });

    if (!guildSuggestion) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.utility.suggest.system-not-enabled",
          locale: language,
        }),
      });
    }

    const userSuggestion = await prisma.userSuggestion.findUnique({
      where: {
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

    const channel = interaction.guild?.channels.get(guildSuggestion.channel_id);

    if (
      channel &&
      channel.type === ChannelTypes.GUILD_TEXT &&
      channel
        .permissionsOf(interaction.guild?.clientMember as Member)
        .has("VIEW_CHANNEL", "SEND_MESSAGES")
    ) {
      const user = await fetchUser(userSuggestion.user_id);
      const response = await channel.createMessage({
        embeds: new EmbedBuilder()
          .setAuthor({
            name: user?.username ?? "Unknown User",
            iconURL: user?.avatarURL() ?? client.user.avatarURL(),
          })
          .setThumbnail(user?.avatarURL() ?? client.user.avatarURL())
          .setDescription(userSuggestion.content)
          .setColor(client.config.colors.color)
          .toJSONArray(),
        components: new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
              .setCustomID("suggest-upvote")
              .setLabel("0")
              .setStyle(ButtonStyles.SECONDARY)
              .setEmoji({
                name: "_",
                id: "1201583878205353994",
              }),
            new ButtonBuilder()
              .setCustomID("suggest-downvote")
              .setLabel("0")
              .setStyle(ButtonStyles.SECONDARY)
              .setEmoji({
                name: "_",
                id: "1201583875424538675",
              }),
            new ButtonBuilder()
              .setCustomID("suggest-manage")
              .setStyle(ButtonStyles.SECONDARY)
              .setEmoji({
                name: "_",
                id: "1201584289473630208",
              }),
            new ButtonBuilder()
              .setCustomID("suggest-report")
              .setLabel(
                client.locales.__({
                  phrase: "commands.utility.suggest.row.report.label",
                  locale: language,
                }),
              )
              .setStyle(ButtonStyles.DANGER)
              .setEmoji({
                name: "_",
                id: "1201583419524657315",
              }),
          ])
          .toJSONArray(),
      });

      await prisma.userSuggestion
        .update({
          where: {
            message_id: userSuggestion.message_id,
          },
          data: {
            message_id: response.id,
            status: "PENDING",
          },
        })
        .then(async () => {
          await interaction.message.edit({
            embeds: new EmbedBuilder()
              .setDescription(
                client.locales.__mf(
                  {
                    phrase:
                      "commands.utility.suggest.row.status.approve.message",
                    locale: language,
                  },
                  {
                    channel: channel.mention,
                  },
                ),
              )
              .setColor(client.config.colors.success)
              .toJSONArray(),
            components: [],
          });
        });

      if (guildSuggestion.threads && premium) {
        await sleep(1500);
        await response
          .startThread({
            name: `${user?.username ?? "Unknown User"} suggestion`,
            autoArchiveDuration: 1440,
          })
          .catch(() => null);
      }
    }
  },
});
