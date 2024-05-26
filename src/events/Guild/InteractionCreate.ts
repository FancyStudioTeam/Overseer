import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RateLimitManager } from "@sapphire/ratelimits";
import { Result } from "@sapphire/result";
import {
  type AnyInteractionGateway,
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
} from "oceanic.js";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "#builders";
import { Colors, Emojis, Links } from "#constants";
import { _client } from "#index";
import { Translations } from "#locales";
import { prisma } from "#prisma";
import type { Locales } from "#types";
import {
  CheckPermissionsFrom,
  UnixType,
  checkPermissions,
  errorMessage,
  formatUnix,
  handleError,
  parseEmoji,
} from "#util";

const commandRateLimiter = new RateLimitManager(5_000, 3);
const componentRateLimiter = new RateLimitManager(7_000, 5);

_client.on("interactionCreate", async (_interaction: AnyInteractionGateway) => {
  if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) return;
  if (!_interaction.channel) return;
  if (_interaction.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (_interaction.user.bot) return;

  const guildConfiguration = await prisma.guildConfiguration.findUnique({
    where: {
      guild_id: _interaction.guildID,
    },
  });
  const locale = <Locales>(
    (guildConfiguration?.general.locale ?? "en").toUpperCase()
  );
  const timezone = guildConfiguration?.general.timezone ?? "UTC";
  const hour12 = guildConfiguration?.general.use_12_hours ?? false;
  const premium = guildConfiguration?.premium.enabled ?? false;

  if (
    !(await checkPermissions(
      {
        _context: _interaction,
        locale,
        ephemeral: true,
      },
      CheckPermissionsFrom.CHANNEL,
      ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
      _interaction.guild.clientMember,
      _interaction.channel,
    ))
  )
    return;

  if (
    process.env.NODE_ENV?.toUpperCase() === "MAINTENANCE" &&
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
          readFileSync(join(process.cwd(), "assets/Images", "Maintenance.png")),
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
      const rateLimit = commandRateLimiter.acquire(_interaction.user.id);

      if (rateLimit.limited) {
        return await errorMessage(
          {
            _context: _interaction,
            ephemeral: true,
          },
          {
            description: Translations[locale].GENERAL.USER_IS_LIMITED({
              resets: formatUnix(
                UnixType.RELATIVE,
                new Date(rateLimit.expires),
              ),
            }),
          },
        );
      }

      rateLimit.consume();

      switch (_interaction.data.type) {
        case ApplicationCommandTypes.CHAT_INPUT: {
          await _interaction.defer().catch(() => null);

          _interaction.data.options.getSubCommand()
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
      const rateLimit = componentRateLimiter.acquire(_interaction.user.id);

      if (rateLimit.limited) {
        return await errorMessage(
          {
            _context: _interaction,
            ephemeral: true,
          },
          {
            description: Translations[locale].GENERAL.USER_IS_LIMITED({
              resets: formatUnix(
                UnixType.RELATIVE,
                new Date(rateLimit.expires),
              ),
            }),
          },
        );
      }

      rateLimit.consume();

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
});

async function _handleChatInputCommand({
  _interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  _interaction: CommandInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  const command = _client.interactions.chatInput.get(_interaction.data.name);

  if (command?.name) {
    const result = await Result.fromAsync(async () => {
      await command.run(_client, _interaction, {
        locale,
        timezone,
        hour12,
        premium,
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError(
        {
          _context: _interaction,
          locale,
        },
        error,
      );
    });
  }
}

async function _handleChatInputSubCommand({
  _interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  _interaction: CommandInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) return;

  const name = _interaction.data.options.getSubCommand(true);
  const command = _client.subcommands.get(
    `${_interaction.data.name}_${name.join("_")}`,
  );

  if (command?.name) {
    if (
      command.permissions?.user &&
      !(await checkPermissions(
        {
          _context: _interaction,
          locale,
          ephemeral: true,
        },
        CheckPermissionsFrom.GUILD,
        command.permissions.user,
        _interaction.member,
      ))
    )
      return;

    if (
      command.permissions?.bot &&
      !(await checkPermissions(
        {
          _context: _interaction,
          locale,
          ephemeral: true,
        },
        CheckPermissionsFrom.GUILD,
        command.permissions.bot,
        _interaction.guild.clientMember,
      ))
    )
      return;

    const result = await Result.fromAsync(async () => {
      await command.run(_client, _interaction, {
        locale,
        timezone,
        hour12,
        premium,
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError(
        {
          _context: _interaction,
          locale,
        },
        error,
      );
    });
  }
}

async function _handleUserCommand({
  _interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  _interaction: CommandInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) return;

  const command = _client.interactions.user.get(_interaction.data.name);

  if (command?.name) {
    const result = await Result.fromAsync(async () => {
      await command.run(_client, _interaction, {
        locale,
        timezone,
        hour12,
        premium,
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError(
        {
          _context: _interaction,
          locale,
        },
        error,
      );
    });
  }
}

async function _handleAutocomplete({
  _interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  _interaction: AutocompleteInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  const command = _client.interactions.chatInput.get(_interaction.data.name);

  if (command?.name) {
    const result = await Result.fromAsync(async () => {
      if (command.autocomplete) {
        await command.autocomplete(_client, _interaction, {
          locale,
          timezone,
          hour12,
          premium,
        });
      }
    });

    result.unwrapOrElse(async (error) => {
      await handleError(
        {
          _context: _interaction,
          locale,
        },
        error,
      );
    });
  }
}

async function _handleButton({
  _interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  _interaction: ComponentInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) return;

  const component = _client.components.buttons.get(
    _interaction.data.customID.split("/")[0],
  );

  if (component?.name) {
    if (
      component.permissions?.user &&
      !(await checkPermissions(
        {
          _context: _interaction,
          locale,
          ephemeral: true,
        },
        CheckPermissionsFrom.GUILD,
        component.permissions.user,
        _interaction.member,
      ))
    )
      return;

    if (
      component.permissions?.bot &&
      !(await checkPermissions(
        {
          _context: _interaction,
          locale,
          ephemeral: true,
        },
        CheckPermissionsFrom.GUILD,
        component.permissions.bot,
        _interaction.guild.clientMember,
      ))
    )
      return;

    const result = await Result.fromAsync(async () => {
      await component.run(_client, _interaction, {
        locale,
        timezone,
        hour12,
        premium,
        variable: _interaction.data.customID.split("/")[1] ?? "",
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError(
        {
          _context: _interaction,
          locale,
        },
        error,
      );
    });
  }
}

async function _handleSelectMenu({
  _interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  _interaction: ComponentInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) return;

  const component = _client.components.select.get(
    _interaction.data.customID.split("/")[0],
  );

  if (component?.name) {
    if (
      component.permissions?.user &&
      !(await checkPermissions(
        {
          _context: _interaction,
          locale,
          ephemeral: true,
        },
        CheckPermissionsFrom.GUILD,
        component.permissions.user,
        _interaction.member,
      ))
    )
      return;

    if (
      component.permissions?.bot &&
      !(await checkPermissions(
        {
          _context: _interaction,
          locale,
          ephemeral: true,
        },
        CheckPermissionsFrom.GUILD,
        component.permissions.bot,
        _interaction.guild.clientMember,
      ))
    )
      return;

    const result = await Result.fromAsync(async () => {
      await component.run(_client, _interaction, {
        locale,
        timezone,
        hour12,
        premium,
        variable: _interaction.data.customID.split("/")[1] ?? "",
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError(
        {
          _context: _interaction,
          locale,
        },
        error,
      );
    });
  }
}

async function _handleModalSubmit({
  _interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  _interaction: ModalSubmitInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  const component = _client.components.modals.get(_interaction.data.customID);

  if (component?.name) {
    const result = await Result.fromAsync(async () => {
      await component.run(_client, _interaction, {
        locale,
        timezone,
        hour12,
        premium,
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError(
        {
          _context: _interaction,
          locale,
        },
        error,
      );
    });
  }
}
