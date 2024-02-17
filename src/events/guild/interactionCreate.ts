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
import { ActionRowBuilder } from "../../builders/ActionRow";
import { AttachmentBuilder } from "../../builders/Attachment";
import { ButtonBuilder } from "../../builders/Button";
import { EmbedBuilder } from "../../builders/Embed";
import { Event } from "../../classes/Builders";
import { client } from "../../index";
import { permissions } from "../../locales/misc/reference";
import type {
  ChatInputCommandInterface,
  ComponentInterface,
  ModalInterface,
  SubCommandInterface,
  UserCommandInterface,
} from "../../types";
import { prisma } from "../../util/db";
import { consume, errorMessage, handleError } from "../../util/util";

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
    const requiredPermissions: PermissionName[] = [];

    (
      [
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "EMBED_LINKS",
        "USE_EXTERNAL_EMOJIS",
      ] as PermissionName[]
    ).forEach((p, _) => {
      if (
        !interaction.channel
          .permissionsOf(interaction.guild.clientMember)
          .has(p)
      ) {
        requiredPermissions.push(p);
      }
    });

    if (
      !interaction.channel
        .permissionsOf(interaction.guild.clientMember)
        .has(...requiredPermissions) &&
      "reply" in interaction
    ) {
      return interaction.reply({
        embeds: new EmbedBuilder()
          .setDescription(
            client.locales.__mf(
              {
                phrase: "general.permissions.bot-channel-permissions",
                locale: language,
              },
              {
                permission: requiredPermissions
                  .map((p, _) => {
                    return permissions[p][language];
                  })
                  .join(", "),
                channel: interaction.channel.mention,
              },
            ),
          )
          .setColor(client.config.colors.error)
          .toJSONArray(),
        components: new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
              .setLabel(
                client.locales.__({
                  phrase: "general.permissions.row.hierarchy.label",
                  locale: language,
                }),
              )
              .setStyle(ButtonStyles.LINK)
              .setEmoji({
                name: "_",
                id: "1201589945853296780",
              })
              .setURL(
                "https://support.discord.com/hc/en-us/articles/206141927",
              ),
            new ButtonBuilder()
              .setLabel(
                client.locales.__({
                  phrase: "general.permissions.row.configure.label",
                  locale: language,
                }),
              )
              .setStyle(ButtonStyles.LINK)
              .setEmoji({
                name: "_",
                id: "1201589945853296780",
              })
              .setURL(
                "https://support.discord.com/hc/en-us/articles/206029707",
              ),
          ])
          .toJSONArray(),
        flags: MessageFlags.EPHEMERAL,
      });
    }

    if (
      process.env.NODE_ENV?.toLowerCase() === "maintenance" &&
      "reply" in interaction
    ) {
      return interaction.reply({
        embeds: new EmbedBuilder()
          .setImage("attachment://maintenance.png")
          .setColor(client.config.colors.color)
          .toJSONArray(),
        files: new AttachmentBuilder()
          .setName("maintenance.png")
          .setContent(
            readFileSync(
              join(__dirname, "../..", "assets/images", "Maintenance.png"),
            ),
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
              .setURL(client.config.links.support),
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
            },
          ),
        });
      }

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
                  !interaction.member.permissions.has(
                    subcommand.permissions.user as PermissionName,
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
                      },
                    ),
                  });
                }

                if (
                  subcommand.permissions?.bot &&
                  !interaction.guild.clientMember.permissions.has(
                    subcommand.permissions.user as PermissionName,
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
                      },
                    ),
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
      const rateLimit = await consume(
        interaction.user.id,
        componentRateLimiter,
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
            },
          ),
        });
      }

      if (interaction.isButtonComponentInteraction()) {
        if (interaction.data.customID.includes("/")) {
          const button = client.components.buttons.get(
            interaction.data.customID.split("/")[0],
          ) as ComponentInterface;

          if (button) {
            await button
              .run(client, interaction, {
                language: language,
                timezone: timezone,
                hour12: hour12,
                premium: premium,
                variable: interaction.data.customID.split("/")[1],
              })
              .catch((error) => {
                handleError(error, interaction, language);
              });
          }
        }

        const button = client.components.buttons.get(
          interaction.data.customID,
        ) as ComponentInterface;

        if (button) {
          if (
            button.permissions?.user &&
            !interaction.member.permissions.has(
              button.permissions.user as PermissionName,
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
                },
              ),
            });
          }

          if (
            button.permissions?.bot &&
            !interaction.guild.clientMember.permissions.has(
              button.permissions.user as PermissionName,
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
                },
              ),
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
            !interaction.member.permissions.has(
              select.permissions.user as PermissionName,
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
                },
              ),
            });
          }

          if (
            select.permissions?.bot &&
            !interaction.guild.clientMember.permissions.has(
              select.permissions.user as PermissionName,
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
                },
              ),
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
