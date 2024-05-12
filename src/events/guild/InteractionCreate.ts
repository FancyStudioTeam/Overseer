import { readFileSync } from "node:fs";
import { join } from "node:path";
import humanize from "humanize-duration";
import {
  type AnyInteractionChannel,
  type AnyInteractionGateway,
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type AutocompleteInteraction,
  ButtonStyles,
  ChannelTypes,
  type CommandInteraction,
  type ComponentInteraction,
  ComponentTypes,
  InteractionTypes,
  MessageFlags,
  type ModalSubmitInteraction,
  type Uncached,
} from "oceanic.js";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { _client } from "../..";
import { ActionRowBuilder } from "../../builders/ActionRow";
import { AttachmentBuilder } from "../../builders/Attachment";
import { ButtonBuilder } from "../../builders/Button";
import { EmbedBuilder } from "../../builders/Embed";
import { Colors, Emojis, Links } from "../../constants";
import { Translations } from "../../locales";
import { Permissions } from "../../locales/misc/Reference";
import { type Locales, LoggerType } from "../../types";
import { prisma } from "../../util/db";
import {
  checkChannelPermissions,
  consume,
  errorMessage,
  handleError,
  logger,
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

_client.on(
  "interactionCreate",
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity:
  async (_interaction: AnyInteractionGateway) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) return;
    if (!_interaction.channel) return;
    if (_interaction.channel.type !== ChannelTypes.GUILD_TEXT) return;
    if (_interaction.user.bot) return;

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: _interaction.guild.id,
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
          _context: _interaction,
          locale,
        },
        ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
        _interaction.guild.clientMember,
        _interaction.channel,
        true
      )
    )
      return;

    if (
      process.env.NODE_ENV?.toLowerCase() === "maintenance" &&
      "reply" in _interaction
    ) {
      return await _interaction.reply({
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

    switch (_interaction.type) {
      case InteractionTypes.APPLICATION_COMMAND: {
        const rateLimit = await consume(
          _interaction.user.id,
          commandRateLimiter
        );

        if (rateLimit.rateLimited) {
          return await errorMessage(_interaction, true, {
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

        switch (_interaction.data.type) {
          case ApplicationCommandTypes.CHAT_INPUT: {
            await _interaction.defer().catch(() => null);

            _interaction.data.options.raw.some((o) =>
              [
                ApplicationCommandOptionTypes.SUB_COMMAND,
                ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
              ].includes(o.type)
            )
              ? await _handleChatInputSubCommand({
                  _interaction,
                  locale,
                  timezone,
                  hour12,
                  premium,
                })
              : await _handleChatInputCommand({
                  _interaction,
                  locale,
                  timezone,
                  hour12,
                  premium,
                });

            break;
          }
          case ApplicationCommandTypes.USER: {
            await _handleUserCommand({
              _interaction,
              locale,
              timezone,
              hour12,
              premium,
            });

            break;
          }
        }

        break;
      }
      case InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE: {
        await _handleAutocomplete({
          _interaction,
          locale,
          timezone,
          hour12,
          premium,
        });

        break;
      }
      case InteractionTypes.MESSAGE_COMPONENT: {
        const rateLimit = await consume(
          _interaction.user.id,
          componentRateLimiter
        );

        if (rateLimit.rateLimited) {
          return await errorMessage(_interaction, true, {
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

        switch (_interaction.data.componentType) {
          case ComponentTypes.BUTTON: {
            await _handleButton({
              _interaction,
              locale,
              timezone,
              hour12,
              premium,
            });

            break;
          }
          case ComponentTypes.STRING_SELECT: {
            await _handleSelectMenu({
              _interaction,
              locale,
              timezone,
              hour12,
              premium,
            });

            break;
          }
        }

        break;
      }
      case InteractionTypes.MODAL_SUBMIT: {
        await _handleModalSubmit({
          _interaction,
          locale,
          timezone,
          hour12,
          premium,
        });

        break;
      }
    }
  }
);

async function _handleChatInputCommand(main: {
  _interaction: CommandInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  const command = _client.interactions.chatInput.get(
    main._interaction.data.name
  );

  if (command?.name) {
    await command
      .run(
        _client,
        <
          CommandInteraction<
            AnyInteractionChannel | Uncached,
            ApplicationCommandTypes.CHAT_INPUT
          >
        >main._interaction,
        {
          locale: main.locale,
          timezone: main.timezone,
          hour12: main.hour12,
          premium: main.premium,
        }
      )
      .catch(async (error) => {
        await handleError(
          {
            _context: main._interaction,
            locale: main.locale,
          },
          error
        );
      })
      .finally(() => {
        send({ _interaction: main._interaction });
      });
  }
}

async function _handleChatInputSubCommand(main: {
  _interaction: CommandInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(main._interaction.inCachedGuildChannel() && main._interaction.guild))
    return;

  const name = main._interaction.data.options.getSubCommand(true);
  const command = _client.subcommands.get(
    `${main._interaction.data.name}_${name.join("_")}`
  );

  if (command?.name) {
    if (
      command.permissions?.user &&
      !main._interaction.member.permissions.has(command.permissions.user)
    ) {
      return await errorMessage(main._interaction, true, {
        description: Translations[main.locale].GENERAL.PERMISSIONS.GUILD.USER({
          permissions: Permissions[main.locale][command.permissions.user],
        }),
      });
    }

    if (
      command.permissions?.bot &&
      !main._interaction.guild.clientMember.permissions.has(
        command.permissions.bot
      )
    ) {
      return await errorMessage(main._interaction, true, {
        description: Translations[main.locale].GENERAL.PERMISSIONS.GUILD.CLIENT(
          {
            permissions: Permissions[main.locale][command.permissions.bot],
          }
        ),
      });
    }

    await command
      .run(
        _client,
        <
          CommandInteraction<
            AnyInteractionChannel | Uncached,
            ApplicationCommandTypes.CHAT_INPUT
          >
        >main._interaction,
        {
          locale: main.locale,
          timezone: main.timezone,
          hour12: main.hour12,
          premium: main.premium,
        }
      )
      .catch(async (error) => {
        await handleError(
          {
            _context: main._interaction,
            locale: main.locale,
          },
          error
        );
      })
      .finally(() => {
        send({ _interaction: main._interaction });
      });
  }
}

async function _handleUserCommand(main: {
  _interaction: CommandInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(main._interaction.inCachedGuildChannel() && main._interaction.guild))
    return;

  const command = _client.interactions.user.get(main._interaction.data.name);

  if (command?.name) {
    await command
      .run(
        _client,
        <
          CommandInteraction<
            AnyInteractionChannel | Uncached,
            ApplicationCommandTypes.USER
          >
        >main._interaction,
        {
          locale: main.locale,
          timezone: main.timezone,
          hour12: main.hour12,
          premium: main.premium,
        }
      )
      .catch(async (error) => {
        await handleError(
          {
            _context: main._interaction,
            locale: main.locale,
          },
          error
        );
      })
      .finally(() => {
        send({ _interaction: main._interaction });
      });
  }
}

async function _handleAutocomplete(main: {
  _interaction: AutocompleteInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  const command = _client.interactions.chatInput.get(
    main._interaction.data.name
  );

  if (command?.name && command.autocomplete) {
    await command
      .autocomplete(_client, main._interaction, {
        locale: main.locale,
        timezone: main.timezone,
        hour12: main.hour12,
        premium: main.premium,
      })
      .catch(async (error) => {
        await handleError(
          {
            _context: main._interaction,
            locale: main.locale,
          },
          error
        );
      });
  }
}

async function _handleButton(main: {
  _interaction: ComponentInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(main._interaction.inCachedGuildChannel() && main._interaction.guild))
    return;

  const component = _client.components.buttons.get(
    main._interaction.data.customID.split("/")[0]
  );

  if (component?.name) {
    if (
      component.permissions?.user &&
      !main._interaction.member.permissions.has(component.permissions.user)
    ) {
      return await errorMessage(main._interaction, true, {
        description: Translations[main.locale].GENERAL.PERMISSIONS.GUILD.USER({
          permissions: Permissions[main.locale][component.permissions.user],
        }),
      });
    }

    if (
      component.permissions?.bot &&
      !main._interaction.guild.clientMember.permissions.has(
        component.permissions.bot
      )
    ) {
      return await errorMessage(main._interaction, true, {
        description: Translations[main.locale].GENERAL.PERMISSIONS.GUILD.CLIENT(
          {
            permissions: Permissions[main.locale][component.permissions.bot],
          }
        ),
      });
    }

    await component
      .run(_client, main._interaction, {
        locale: main.locale,
        timezone: main.timezone,
        hour12: main.hour12,
        premium: main.premium,
        variable: main._interaction.data.customID.split("/")[1] ?? "",
      })
      .catch(async (error) => {
        await handleError(
          {
            _context: main._interaction,
            locale: main.locale,
          },
          error
        );
      })
      .finally(() => {
        send({ _interaction: main._interaction });
      });
  }
}

async function _handleSelectMenu(main: {
  _interaction: ComponentInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(main._interaction.inCachedGuildChannel() && main._interaction.guild))
    return;

  const component = _client.components.select.get(
    main._interaction.data.customID.split("/")[0]
  );

  if (component?.name) {
    if (
      component.permissions?.user &&
      !main._interaction.member.permissions.has(component.permissions.user)
    ) {
      return await errorMessage(main._interaction, true, {
        description: Translations[main.locale].GENERAL.PERMISSIONS.GUILD.USER({
          permissions: Permissions[main.locale][component.permissions.user],
        }),
      });
    }

    if (
      component.permissions?.bot &&
      !main._interaction.guild.clientMember.permissions.has(
        component.permissions.bot
      )
    ) {
      return await errorMessage(main._interaction, true, {
        description: Translations[main.locale].GENERAL.PERMISSIONS.GUILD.CLIENT(
          {
            permissions: Permissions[main.locale][component.permissions.bot],
          }
        ),
      });
    }

    await component
      .run(_client, main._interaction, {
        locale: main.locale,
        timezone: main.timezone,
        hour12: main.hour12,
        premium: main.premium,
        variable: main._interaction.data.customID.split("/")[1] ?? "",
      })
      .catch(async (error) => {
        await handleError(
          {
            _context: main._interaction,
            locale: main.locale,
          },
          error
        );
      })
      .finally(() => {
        send({ _interaction: main._interaction });
      });
  }
}

async function _handleModalSubmit(main: {
  _interaction: ModalSubmitInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  const component = _client.components.modals.get(
    main._interaction.data.customID
  );

  if (component?.name) {
    await component
      .run(_client, main._interaction, {
        locale: main.locale,
        timezone: main.timezone,
        hour12: main.hour12,
        premium: main.premium,
      })
      .catch(async (error) => {
        await handleError(
          {
            _context: main._interaction,
            locale: main.locale,
          },
          error
        );
      })
      .finally(() => {
        send({ _interaction: main._interaction });
      });
  }
}

function send(main: { _interaction: AnyInteractionGateway }): void {
  let message = "";

  switch (main._interaction.type) {
    case InteractionTypes.APPLICATION_COMMAND: {
      message = `Command: ${
        main._interaction.data.options.raw.some((o) =>
          [
            ApplicationCommandOptionTypes.SUB_COMMAND,
            ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
          ].includes(o.type)
        )
          ? `${main._interaction.data.name} ${main._interaction.data.options
              .getSubCommand(true)
              .join(" ")}`
          : `${main._interaction.data.name}`
      } | User: ${main._interaction.user.username} (${
        main._interaction.user.id
      }) | Guild: ${
        main._interaction.inCachedGuildChannel()
          ? `${main._interaction.guild.name} (${main._interaction.guildID})`
          : "Unknown Guild"
      }`;

      break;
    }
    case InteractionTypes.MESSAGE_COMPONENT: {
      message = `Component: ${main._interaction.data.customID} | User: ${
        main._interaction.user.username
      } (${main._interaction.user.id}) | Guild: ${
        main._interaction.inCachedGuildChannel()
          ? `${main._interaction.guild.name} (${main._interaction.guildID})`
          : "Unknown Guild"
      }`;

      break;
    }
    case InteractionTypes.MODAL_SUBMIT: {
      message = `Modal: ${main._interaction.data.customID} | User: ${
        main._interaction.user.username
      } (${main._interaction.user.id}) | Guild: ${
        main._interaction.inCachedGuildChannel()
          ? `${main._interaction.guild.name} (${main._interaction.guildID})`
          : "Unknown Guild"
      }`;

      break;
    }
  }

  logger(LoggerType.MISC, message);
}
