import { InteractionCollector } from "oceanic-collector";
import {
  type AnyInteractionGateway,
  ButtonStyles,
  type CommandInteraction,
  InteractionTypes,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../../builders/ActionRow";
import { ButtonBuilder } from "../../../../builders/Button";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { prisma } from "../../../../util/db";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "premium_revoke",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    if (interaction.user.id !== interaction.guild.ownerID) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.configuration.premium.revoke.only-guild-owner",
          locale: language,
        }),
      });
    }

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: interaction.guild.id,
      },
    });

    if (!guildConfiguration || !guildConfiguration.premium) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.configuration.premium.revoke.no-guild-premium",
          locale: language,
        }),
      });
    }

    const response = await interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          client.locales.__({
            phrase: "commands.configuration.premium.revoke.message",
            locale: language,
          }),
        )
        .setColor(client.config.colors.warning)
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setCustomID("premium-revoke-confirm")
            .setLabel(
              client.locales.__({
                phrase:
                  "commands.configuration.premium.revoke.row.confirm.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1201582315915190312",
            }),
        ])
        .toJSONArray(),
    });
    const message = response.hasMessage()
      ? response.message
      : await response.getMessage();
    const collector = new InteractionCollector({
      client: client,
      message: message,
      channel: interaction.channel,
      guild: interaction.guild,
      interactionType: InteractionTypes.MESSAGE_COMPONENT,
      time: 15000,
    });

    collector.on("collect", async (collected: AnyInteractionGateway) => {
      if (collected.isComponentInteraction()) {
        if (!collected.inCachedGuildChannel() || !collected.guild) {
          return errorMessage(collected, true, {
            description: client.locales.__({
              phrase: "general.cannot-get-guild",
              locale: language,
            }),
          });
        }

        if (collected.user.id !== interaction.user.id) {
          return errorMessage(collected, true, {
            description: client.locales.__({
              phrase:
                "commands.configuration.premium.revoke.row.invalid-user-collector",
              locale: language,
            }),
          });
        }

        if (collected.isButtonComponentInteraction()) {
          switch (collected.data.customID) {
            case "premium-revoke-confirm": {
              await prisma.guildConfiguration
                .update({
                  where: {
                    guild_id: collected.guild.id,
                  },
                  data: {
                    premium: false,
                    expires_at: 0,
                  },
                })
                .then(() => {
                  collector.stop();
                  collected.reply({
                    embeds: new EmbedBuilder()
                      .setDescription(
                        client.locales.__({
                          phrase:
                            "commands.configuration.premium.revoke.row.confirm.message",
                          locale: language,
                        }),
                      )
                      .setColor(client.config.colors.success)
                      .toJSONArray(),
                    components: [],
                  });
                });

              break;
            }
          }
        }
      }
    });

    collector.on("end", async () => {
      collector.removeAllListeners();

      message.components.forEach((r, _) => {
        r.components.forEach((c, _) => {
          c.disabled = true;
        });
      });

      await client.rest.channels
        .editMessage(interaction.channelID, message.id, {
          components: message.components,
        })
        .catch(() => null);
    });
  },
});
