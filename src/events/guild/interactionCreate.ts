import { readFileSync } from "fs";
import { join } from "node:path";
import {
  type AnyInteractionGateway,
  ApplicationCommandOptionTypes,
  ButtonStyles,
  MessageFlags,
  type PermissionName,
} from "oceanic.js";
import { ActionRowBuilder } from "../../builders/ActionRow";
import { ButtonBuilder } from "../../builders/Button";
import { EmbedBuilder } from "../../builders/Embed";
import { Event } from "../../classes/Builders";
import { client } from "../../index";
import type {
  ChatInputCommandInterface,
  ComponentInterface,
  ModalInterface,
  SubCommandInterface,
  UserCommandInterface,
} from "../../types";
import { prisma } from "../../util/db";
import { permissions } from "../../util/reference";
import { errorMessage, handleError } from "../../util/util";

export default new Event(
  "interactionCreate",
  false,
  async (interaction: AnyInteractionGateway) => {
    if (!interaction.guild) return;
    if (!interaction.channel) return;
    if (interaction.user.bot) return;

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: interaction.guild.id,
      },
    });
    const language = guildConfiguration?.language ?? "en";
    const timezone = guildConfiguration?.timezone ?? "UTC";
    const hour12 = guildConfiguration?.hour12 ?? false;
    const premium = guildConfiguration?.premium ?? false;

    if (process.env.NODE_ENV === "maintenance") {
      if (
        interaction.isCommandInteraction() ||
        interaction.isComponentInteraction() ||
        interaction.isModelSubmitInteraction()
      ) {
        return interaction.reply({
          embeds: new EmbedBuilder()
            .setImage("attachment://maintenance.png")
            .setColor(client.config.colors.color)
            .toJSONArray(),
          files: [
            {
              name: "maintenance.png",
              contents: readFileSync(
                join(__dirname, "../..", "assets", "images", "Maintenance.png"),
              ),
            },
          ],
          components: new ActionRowBuilder()
            .addComponents([
              new ButtonBuilder()
                .setLabel("Support Server")
                .setStyle(ButtonStyles.LINK)
                .setEmoji({
                  name: "_",
                  id: "1201585025028735016",
                })
                .setURL(client.config.links.support),
            ])
            .toJSONArray(),
          flags: MessageFlags.EPHEMERAL,
        });
      }
    }

    if (interaction.isCommandInteraction()) {
      if (interaction.isChatInputCommand()) {
        await interaction.defer().catch(() => null);

        const command = client.interactions.chatInput.get(
          interaction.data.name,
        ) as ChatInputCommandInterface;

        if (command) {
          if (
            command.options?.some((o) =>
              [
                ApplicationCommandOptionTypes.SUB_COMMAND,
                ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
              ].includes(o.type),
            )
          ) {
            const name = interaction.data.options.getSubCommand();

            if (name) {
              const subcommand = client.subcommands.get(
                `${interaction.data.name}_${name.join("_")}`,
              ) as SubCommandInterface;

              if (subcommand) {
                if (
                  subcommand.permissions?.user &&
                  !interaction.member?.permissions.has(
                    subcommand.permissions.user as PermissionName,
                  )
                ) {
                  return errorMessage(interaction, true, {
                    fields: [
                      {
                        name: client.locales.__({
                          phrase: "general.invalid-user-permissions.field",
                          locale: language,
                        }),
                        value: `\`\`\`ansi\n\x1b[1;35m${client.locales.__mf(
                          {
                            phrase: "general.invalid-user-permissions.value",
                            locale: language,
                          },
                          {
                            permission:
                              permissions[
                                subcommand.permissions
                                  .user as keyof typeof permissions
                              ],
                          },
                        )}\x1b[0m\`\`\``,
                      },
                    ],
                  });
                }

                if (
                  subcommand.permissions?.bot &&
                  !interaction.guild.clientMember.permissions.has(
                    subcommand.permissions.user as PermissionName,
                  )
                ) {
                  return errorMessage(interaction, true, {
                    fields: [
                      {
                        name: client.locales.__({
                          phrase: "general.invalid-bot-permissions.field",
                          locale: language,
                        }),
                        value: `\`\`\`ansi\n\x1b[1;35m${client.locales.__mf(
                          {
                            phrase: "general.invalid-bot-permissions.value",
                            locale: language,
                          },
                          {
                            permission:
                              permissions[
                                subcommand.permissions
                                  .bot as keyof typeof permissions
                              ],
                          },
                        )}\x1b[0m\`\`\``,
                      },
                    ],
                  });
                }

                await subcommand
                  .run(client, interaction, {
                    language: language,
                    timezone: timezone,
                    hour12: hour12,
                    premium: premium,
                  })
                  .catch((error) => {
                    handleError(error, interaction, language);
                  });
              }
            }
          } else {
            if (command.run) {
              await command
                .run(client, interaction, {
                  language: language,
                  timezone: timezone,
                  hour12: hour12,
                  premium: premium,
                })
                .catch((error) => {
                  handleError(error, interaction, language);
                });
            }
          }
        }
      }

      if (interaction.isUserCommand()) {
        const command = client.interactions.user.get(
          interaction.data.name,
        ) as UserCommandInterface;

        if (command) {
          await command
            .run(client, interaction, {
              language: language,
              timezone: timezone,
              hour12: hour12,
              premium: premium,
            })
            .catch((error) => {
              handleError(error, interaction, language);
            });
        }
      }
    }

    if (interaction.isAutocompleteInteraction()) {
      const command = client.interactions.chatInput.get(
        interaction.data.name,
      ) as ChatInputCommandInterface;

      if (command?.autocomplete) {
        command.autocomplete(interaction);
      }
    }

    if (interaction.isModelSubmitInteraction()) {
      const modal = client.components.modals.get(
        interaction.data.customID,
      ) as ModalInterface;

      if (modal) {
        await modal
          .run(client, interaction, {
            language: language,
            timezone: timezone,
            hour12: hour12,
            premium: premium,
          })
          .catch((error) => {
            handleError(error, interaction, language);
          });
      }
    }

    if (interaction.isComponentInteraction()) {
      if (interaction.isButtonComponentInteraction()) {
        /*if (interaction.data.customID.split("/").at(1)?.length) {
					const button = client.components.buttons.get(
						interaction.data.customID.split("/").at(0) as string,
					) as ComponentInterface;

					if (button) {
						await button
							.run(client, interaction, {
								language: language,
								timezone: timezone,
								hour12: hour12,
								premium: premium,
								variable: interaction.data.customID.split("/").at(1),
							})
							.catch((error) => {
								handleError(error, interaction, language);
							});
					}
				}*/

        const button = client.components.buttons.get(
          interaction.data.customID,
        ) as ComponentInterface;

        if (button) {
          if (
            button.permissions?.user &&
            !interaction.member?.permissions.has(
              button.permissions.user as PermissionName,
            )
          ) {
            return errorMessage(interaction, true, {
              fields: [
                {
                  name: client.locales.__({
                    phrase: "general.invalid-user-permissions.field",
                    locale: language,
                  }),
                  value: `\`\`\`ansi\n\x1b[1;35m${client.locales.__mf(
                    {
                      phrase: "general.invalid-user-permissions.value",
                      locale: language,
                    },
                    {
                      permission:
                        permissions[
                          button.permissions.user as keyof typeof permissions
                        ],
                    },
                  )}\x1b[0m\`\`\``,
                },
              ],
            });
          }

          if (
            button.permissions?.bot &&
            !interaction.guild.clientMember.permissions.has(
              button.permissions.user as PermissionName,
            )
          ) {
            return errorMessage(interaction, true, {
              fields: [
                {
                  name: client.locales.__({
                    phrase: "general.invalid-bot-permissions.field",
                    locale: language,
                  }),
                  value: `\`\`\`ansi\n\x1b[1;35m${client.locales.__mf(
                    {
                      phrase: "general.invalid-bot-permissions.value",
                      locale: language,
                    },
                    {
                      permission:
                        permissions[
                          button.permissions.bot as keyof typeof permissions
                        ],
                    },
                  )}\x1b[0m\`\`\``,
                },
              ],
            });
          }

          await button
            .run(client, interaction, {
              language: language,
              timezone: timezone,
              hour12: hour12,
              premium: premium,
            })
            .catch((error) => {
              handleError(error, interaction, language);
            });
        }
      }

      if (interaction.isSelectMenuComponentInteraction()) {
        const select = client.components.select.get(
          interaction.data.customID,
        ) as ComponentInterface;

        if (select) {
          if (
            select.permissions?.user &&
            !interaction.member?.permissions.has(
              select.permissions.user as PermissionName,
            )
          ) {
            return errorMessage(interaction, true, {
              fields: [
                {
                  name: client.locales.__({
                    phrase: "general.invalid-user-permissions.field",
                    locale: language,
                  }),
                  value: `\`\`\`ansi\n\x1b[1;35m${client.locales.__mf(
                    {
                      phrase: "general.invalid-user-permissions.value",
                      locale: language,
                    },
                    {
                      permission:
                        permissions[
                          select.permissions.user as keyof typeof permissions
                        ],
                    },
                  )}\x1b[0m\`\`\``,
                },
              ],
            });
          }

          if (
            select.permissions?.bot &&
            !interaction.guild.clientMember.permissions.has(
              select.permissions.user as PermissionName,
            )
          ) {
            return errorMessage(interaction, true, {
              fields: [
                {
                  name: client.locales.__({
                    phrase: "general.invalid-bot-permissions.field",
                    locale: language,
                  }),
                  value: `\`\`\`ansi\n\x1b[1;35m${client.locales.__mf(
                    {
                      phrase: "general.invalid-bot-permissions.value",
                      locale: language,
                    },
                    {
                      permission:
                        permissions[
                          select.permissions.bot as keyof typeof permissions
                        ],
                    },
                  )}\x1b[0m\`\`\``,
                },
              ],
            });
          }

          await select
            .run(client, interaction, {
              language: language,
              timezone: timezone,
              hour12: hour12,
              premium: premium,
            })
            .catch((error) => {
              handleError(error, interaction, language);
            });
        }
      }
    }

    return;
  },
);
