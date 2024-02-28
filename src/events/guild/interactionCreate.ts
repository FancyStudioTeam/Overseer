import { readFileSync } from "node:fs";
import { join } from "node:path";
import humanize from "humanize-duration";
import {
  type AnyInteractionGateway,
  ApplicationCommandOptionTypes,
  ButtonStyles,
  ChannelTypes,
  MessageFlags,
  type PermissionName,
} from "oceanic.js";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { client } from "../..";
import { ActionRowBuilder } from "../../builders/ActionRow";
import { AttachmentBuilder } from "../../builders/Attachment";
import { ButtonBuilder } from "../../builders/Button";
import { EmbedBuilder } from "../../builders/Embed";
import { Event } from "../../classes/Builders";
import { permissions } from "../../locales/misc/reference";
import type {
  ChatInputCommandInterface,
  ComponentInterface,
  Locales,
  ModalInterface,
  SubCommandInterface,
  UserCommandInterface,
} from "../../types";
import { prisma } from "../../util/db";
import {
  checkChannelPermissions,
  consume,
  errorMessage,
  handleError,
} from "../../util/util";

const commandRateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 5,
  blockDuration: 7,
});
const componentRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 7,
  blockDuration: 10,
});

export default new Event(
  "interactionCreate",
  false,
  async (interaction: AnyInteractionGateway) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) return;
    if (!interaction.channel) return;
    if (interaction.channel.type !== ChannelTypes.GUILD_TEXT) return;
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

    if (
      !checkChannelPermissions(
        {
          client,
          language,
        },
        interaction,
        ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
        interaction.guild.clientMember,
        interaction.channel,
        true
      )
    )
      return;

    if (
      process.env.NODE_ENV?.toLowerCase() === "maintenance" &&
      "reply" in interaction
    ) {
      return interaction.reply({
        embeds: new EmbedBuilder()
          .setImage("attachment://maintenance.png")
          .setColor(client.config.colors.COLOR)
          .toJSONArray(),
        files: new AttachmentBuilder()
          .setName("maintenance.png")
          .setContent(
            readFileSync(
              join(__dirname, "../..", "assets/images", "Maintenance.png")
            )
          )
          .toJSONArray(),
        components: new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
              .setLabel("Support Server")
              .setStyle(ButtonStyles.LINK)
              .setEmoji({
                name: "_",
                id: "1201585025028735016",
              })
              .setURL(client.config.links.SUPPORT),
          ])
          .toJSONArray(),
        flags: MessageFlags.EPHEMERAL,
      });
    }

    if (interaction.isCommandInteraction()) {
      const rateLimit = await consume(interaction.user.id, commandRateLimiter);

      if (rateLimit.rateLimited) {
        return errorMessage(interaction, true, {
          description: client.locales.__mf(
            {
              phrase: "general.rate-limiter",
              locale: language,
            },
            {
              seconds: humanize(rateLimit.resets, {
                round: true,
                largest: 2,
                language: language,
              }),
            }
          ),
        });
      }

      if (interaction.isChatInputCommand()) {
        await interaction.defer().catch(() => null);

        const command = <ChatInputCommandInterface>(
          client.interactions.chatInput.get(interaction.data.name)
        );

        if (command) {
          if (
            command.options?.some((o) =>
              [
                ApplicationCommandOptionTypes.SUB_COMMAND,
                ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
              ].includes(o.type)
            )
          ) {
            const name = interaction.data.options.getSubCommand();

            if (name) {
              const subcommand = <SubCommandInterface>(
                client.subcommands.get(
                  `${interaction.data.name}_${name.join("_")}`
                )
              );

              if (subcommand) {
                if (
                  subcommand.permissions?.user &&
                  !interaction.member.permissions.has(
                    <PermissionName>subcommand.permissions.user
                  )
                ) {
                  return errorMessage(interaction, true, {
                    description: client.locales.__mf(
                      {
                        phrase: "general.permissions.user-guild-permissions",
                        locale: language,
                      },
                      {
                        permission:
                          permissions[subcommand.permissions.user][language],
                      }
                    ),
                  });
                }

                if (
                  subcommand.permissions?.bot &&
                  !interaction.guild.clientMember.permissions.has(
                    <PermissionName>subcommand.permissions.user
                  )
                ) {
                  return errorMessage(interaction, true, {
                    description: client.locales.__mf(
                      {
                        phrase: "general.permissions.bot-guild-permissions",
                        locale: language,
                      },
                      {
                        permission:
                          permissions[subcommand.permissions.bot][language],
                      }
                    ),
                  });
                }

                await subcommand
                  .run(client, interaction, {
                    language: language,
                    locale: <Locales>language,
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
                  locale: <Locales>language,
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
        const command = <UserCommandInterface>(
          client.interactions.user.get(interaction.data.name)
        );

        if (command) {
          await command
            .run(client, interaction, {
              language: language,
              locale: <Locales>language,
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
      const command = <ChatInputCommandInterface>(
        client.interactions.chatInput.get(interaction.data.name)
      );

      if (command?.autocomplete) {
        command.autocomplete(interaction);
      }
    }

    if (interaction.isModelSubmitInteraction()) {
      const modal = <ModalInterface>(
        client.components.modals.get(interaction.data.customID)
      );

      if (modal) {
        await modal
          .run(client, interaction, {
            language: language,
            locale: <Locales>language,
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
      const rateLimit = await consume(
        interaction.user.id,
        componentRateLimiter
      );

      if (rateLimit.rateLimited) {
        return errorMessage(interaction, true, {
          description: client.locales.__mf(
            {
              phrase: "general.rate-limiter",
              locale: language,
            },
            {
              seconds: humanize(rateLimit.resets, {
                round: true,
                largest: 2,
                language: language,
              }),
            }
          ),
        });
      }

      if (interaction.isButtonComponentInteraction()) {
        const button = <ComponentInterface>(
          client.components.buttons.get(interaction.data.customID.split("/")[0])
        );

        if (button) {
          if (
            button.permissions?.user &&
            !interaction.member.permissions.has(
              <PermissionName>button.permissions.user
            )
          ) {
            return errorMessage(interaction, true, {
              description: client.locales.__mf(
                {
                  phrase: "general.permissions.user-guild-permissions",
                  locale: language,
                },
                {
                  permission: permissions[button.permissions.user][language],
                }
              ),
            });
          }

          if (
            button.permissions?.bot &&
            !interaction.guild.clientMember.permissions.has(
              <PermissionName>button.permissions.user
            )
          ) {
            return errorMessage(interaction, true, {
              description: client.locales.__mf(
                {
                  phrase: "general.permissions.user-guild-permissions",
                  locale: language,
                },
                {
                  permission: permissions[button.permissions.bot][language],
                }
              ),
            });
          }

          await button
            .run(client, interaction, {
              language: language,
              locale: <Locales>language,
              timezone: timezone,
              hour12: hour12,
              premium: premium,
              variable: interaction.data.customID.split("/")[1] ?? "",
            })
            .catch((error) => {
              handleError(error, interaction, language);
            });
        }
      }

      if (interaction.isSelectMenuComponentInteraction()) {
        const select = <ComponentInterface>(
          client.components.select.get(interaction.data.customID.split("/")[0])
        );

        if (select) {
          if (
            select.permissions?.user &&
            !interaction.member.permissions.has(
              <PermissionName>select.permissions.user
            )
          ) {
            return errorMessage(interaction, true, {
              description: client.locales.__mf(
                {
                  phrase: "general.permissions.user-guild-permissions",
                  locale: language,
                },
                {
                  permission: permissions[select.permissions.user][language],
                }
              ),
            });
          }

          if (
            select.permissions?.bot &&
            !interaction.guild.clientMember.permissions.has(
              <PermissionName>select.permissions.user
            )
          ) {
            return errorMessage(interaction, true, {
              description: client.locales.__mf(
                {
                  phrase: "general.permissions.user-guild-permissions",
                  locale: language,
                },
                {
                  permission: permissions[select.permissions.bot][language],
                }
              ),
            });
          }

          await select
            .run(client, interaction, {
              language: language,
              locale: <Locales>language,
              timezone: timezone,
              hour12: hour12,
              premium: premium,
              variable: interaction.data.customID.split("/")[1] ?? "",
            })
            .catch((error) => {
              handleError(error, interaction, language);
            });
        }
      }
    }

    return;
  }
);
