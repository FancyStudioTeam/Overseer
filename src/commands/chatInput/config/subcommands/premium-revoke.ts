import { Button, ComponentBuilder, EmbedBuilder } from "@oceanicjs/builders";
import { InteractionCollector } from "oceanic-collector";
import {
  type AnyInteractionGateway,
  ButtonStyles,
  type CommandInteraction,
  type Guild,
  InteractionTypes,
  type MessageActionRow,
} from "oceanic.js";
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
    if (interaction.user.id !== interaction.guild?.ownerID) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.configuration.premium.revoke.only-guild-owner",
          locale: language,
        }),
      });
    }

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: interaction.guild?.id,
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

    await interaction
      .reply({
        embeds: new EmbedBuilder()
          .setDescription(
            client.locales.__({
              phrase: "commands.configuration.premium.revoke.message",
              locale: language,
            }),
          )
          .setColor(client.config.colors.warning)
          .toJSON(true),
        components: new ComponentBuilder<MessageActionRow>()
          .addRow([
            new Button(ButtonStyles.SECONDARY, "premium-revoke-confirm")
              .setLabel(
                client.locales.__({
                  phrase:
                    "commands.configuration.premium.revoke.row.confirm.label",
                  locale: language,
                }),
              )
              .setEmoji({
                name: "_",
                id: "1201582315915190312",
              }),
          ])
          .toJSON(),
      })
      .then(async (response) => {
        const message = response.hasMessage()
          ? response.message
          : await response.getMessage();
        const collector = new InteractionCollector({
          client: client,
          message: message,
          channel: interaction.channel,
          guild: interaction.guild as Guild,
          interactionType: InteractionTypes.MESSAGE_COMPONENT,
          time: 15000,
        });

        collector.on("collect", async (collected: AnyInteractionGateway) => {
          if (collected.isComponentInteraction()) {
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
                        guild_id: interaction.guild?.id,
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
                          .toJSON(true),
                        components: [],
                      });
                    });

                  break;
                }
              }
            }
          }

          return;
        });

        collector.on("end", async () => {
          collector.removeAllListeners();

          message.components.forEach((r, _) => {
            r.components.forEach((c, _) => {
              c.disabled = true;
            });
          });

          await message
            .edit({
              components: message.components,
            })
            .catch(() => null);
        });
      });
  },
});
