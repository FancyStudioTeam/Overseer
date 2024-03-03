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
import { Colors, Emojis, Links } from "../../constants";
import { Translations } from "../../locales";
import { Permissions } from "../../locales/misc/reference";
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
  parseEmoji,
} from "../../util/util";

const commandRateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 5,
  blockDuration: 7,
  keyPrefix: "CommandRateLimiter",
});
const componentRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 7,
  blockDuration: 10,
  keyPrefix: "ComponentRateLimiter",
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
    const locale = <Locales>(
      (guildConfiguration?.language ?? "en").toUpperCase()
    );
    const timezone = guildConfiguration?.timezone ?? "UTC";
    const hour12 = guildConfiguration?.hour12 ?? false;
    const premium = guildConfiguration?.premium ?? false;

    if (
      !checkChannelPermissions(
        {
          locale,
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
          .setColor(Colors.COLOR)
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
              .setEmoji(parseEmoji(Emojis.SUPPORT))
              .setURL(Links.SUPPORT),
          ])
          .toJSONArray(),
        flags: MessageFlags.EPHEMERAL,
      });
    }

    if (interaction.isCommandInteraction()) {
      const rateLimit = await consume(interaction.user.id, commandRateLimiter);

      if (rateLimit.rateLimited) {
        return errorMessage(interaction, true, {
          description: Translations[locale].GENERAL.USER_IS_LIMITED({
            resets: humanize(rateLimit.resets, {
              language: locale,
              largest: 2,
              round: true,
              fallbacks: ["en"],
            }),
          }),
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
                    description: Translations[
                      locale
                    ].GENERAL.PERMISSIONS.GUILD.USER({
                      permissions:
                        Permissions[locale][subcommand.permissions.user],
                    }),
                  });
                }

                if (
                  subcommand.permissions?.bot &&
                  !interaction.guild.clientMember.permissions.has(
                    <PermissionName>subcommand.permissions.bot
                  )
                ) {
                  return errorMessage(interaction, true, {
                    description: Translations[
                      locale
                    ].GENERAL.PERMISSIONS.GUILD.CLIENT({
                      permissions:
                        Permissions[locale][subcommand.permissions.bot],
                    }),
                  });
                }

                await subcommand
                  .run(client, interaction, {
                    locale,
                    timezone,
                    hour12,
                    premium,
                  })
                  .catch((error) => {
                    handleError({ locale }, error, interaction);
                  });
              }
            }
          } else {
            if (command.run) {
              await command
                .run(client, interaction, {
                  locale,
                  timezone,
                  hour12,
                  premium,
                })
                .catch((error) => {
                  handleError({ locale }, error, interaction);
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
              locale,
              timezone,
              hour12,
              premium,
            })
            .catch((error) => {
              handleError({ locale }, error, interaction);
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
            locale,
            timezone,
            hour12,
            premium,
          })
          .catch((error) => {
            handleError({ locale }, error, interaction);
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
          description: Translations[locale].GENERAL.USER_IS_LIMITED({
            resets: humanize(rateLimit.resets, {
              language: locale,
              largest: 2,
              round: true,
              fallbacks: ["en"],
            }),
          }),
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
              description: Translations[locale].GENERAL.PERMISSIONS.GUILD.USER({
                permissions: Permissions[locale][button.permissions.user],
              }),
            });
          }

          if (
            button.permissions?.bot &&
            !interaction.guild.clientMember.permissions.has(
              <PermissionName>button.permissions.bot
            )
          ) {
            return errorMessage(interaction, true, {
              description: Translations[
                locale
              ].GENERAL.PERMISSIONS.GUILD.CLIENT({
                permissions: Permissions[locale][button.permissions.bot],
              }),
            });
          }

          await button
            .run(client, interaction, {
              locale,
              timezone,
              hour12,
              premium,
              variable: interaction.data.customID.split("/")[1] ?? "",
            })
            .catch((error) => {
              handleError({ locale }, error, interaction);
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
              description: Translations[locale].GENERAL.PERMISSIONS.GUILD.USER({
                permissions: Permissions[locale][select.permissions.user],
              }),
            });
          }

          if (
            select.permissions?.bot &&
            !interaction.guild.clientMember.permissions.has(
              <PermissionName>select.permissions.bot
            )
          ) {
            return errorMessage(interaction, true, {
              description: Translations[
                locale
              ].GENERAL.PERMISSIONS.GUILD.CLIENT({
                permissions: Permissions[locale][select.permissions.bot],
              }),
            });
          }

          await select
            .run(client, interaction, {
              locale,
              timezone,
              hour12,
              premium,
              variable: interaction.data.customID.split("/")[1] ?? "",
            })
            .catch((error) => {
              handleError({ locale }, error, interaction);
            });
        }
      }
    }

    return;
  }
);
