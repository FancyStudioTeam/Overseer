import { ChannelTypes, type ComponentInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { buttons } from "../../../modules/suggestions";
import { prisma } from "../../../util/db";
import { errorMessage, fetchUser, sleep } from "../../../util/util";

export default new Component({
  name: "suggest-status-approve",
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language, premium },
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    const guildSuggestion = await prisma.guildSuggestion.findUnique({
      where: {
        guild_id: interaction.guild.id,
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

    const channel = interaction.guild.channels.get(guildSuggestion.channel_id);

    if (!channel) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase:
            "commands.configuration.suggestions.row.general.row.message.channel-not-found",
          locale: language,
        }),
      });
    }

    if (
      channel.type === ChannelTypes.GUILD_TEXT &&
      channel
        .permissionsOf(interaction.guild.clientMember)
        .has(
          "VIEW_CHANNEL",
          "SEND_MESSAGES",
          "EMBED_LINKS",
          "USE_EXTERNAL_EMOJIS",
        )
    ) {
      const user = await fetchUser(userSuggestion.user_id);
      const response = await client.rest.channels.createMessage(channel.id, {
        embeds: new EmbedBuilder()
          .setAuthor({
            name: user?.username ?? "Unknown User",
            iconURL: user?.avatarURL() ?? client.user.avatarURL(),
          })
          .setThumbnail(user?.avatarURL() ?? client.user.avatarURL())
          .setDescription(userSuggestion.content)
          .setColor(client.config.colors.color)
          .toJSONArray(),
        components: buttons(client, language),
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
          await client.rest.channels
            .editMessage(interaction.channelID, interaction.message.id, {
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
            })
            .catch(() => null);
        });

      if (guildSuggestion.threads && premium) {
        await sleep(1500);
        await client.rest.channels
          .startThreadFromMessage(interaction.channelID, response.id, {
            name: `${user?.username ?? "Unknown User"} suggestion`,
            autoArchiveDuration: 1440,
          })
          .catch(() => null);
      }
    }
  },
});
