import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RateLimitManager } from "@sapphire/ratelimits";
import { Result } from "@sapphire/result";
import { ActionRow, Attachment, Button, Embed } from "oceanic-builders";
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
import { Colors, Emojis, Links } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import type { Locales } from "#types";
import { prisma } from "#util/Prisma.js";
import {
  CheckPermissionsFrom,
  UnixType,
  checkPermissions,
  errorMessage,
  formatUnix,
  handleError,
  parseEmoji,
} from "#util/Util.js";

const commandRateLimiter = new RateLimitManager(5000, 3);
const componentRateLimiter = new RateLimitManager(7000, 5);

client.on("interactionCreate", async (_interaction: AnyInteractionGateway) => {
  if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) return;
  if (!_interaction.channel) return;
  if (_interaction.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (_interaction.user.bot) return;

  const guildConfiguration = await prisma.guildConfiguration.findUnique({
    where: {
      guildID: _interaction.guildID,
    },
  });
  const locale = <Locales>(guildConfiguration?.general.locale ?? "en").toUpperCase();
  const timezone = guildConfiguration?.general.timezone ?? "UTC";
  const hour12 = guildConfiguration?.general.use12Hours ?? false;
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

  if (process.env.NODE_ENV?.toUpperCase() === "MAINTENANCE" && "reply" in _interaction) {
    return await _interaction.reply({
      embeds: new Embed().setImage("attachment://maintenance.png").setColor(Colors.COLOR).toJSON(true),
      files: new Attachment()
        .setName("maintenance.png")
        .setContents(readFileSync(join(process.cwd(), "assets/Images", "Maintenance.png")))
        .toJSON(true),
      components: new ActionRow()
        .addComponents([
          new Button()
            .setLabel("Support Server")
            .setStyle(ButtonStyles.LINK)
            .setEmoji(parseEmoji(Emojis.LIFE_BUOY))
            .setURL(Links.SUPPORT),
        ])
        .toJSON(true),
      flags: MessageFlags.EPHEMERAL,
    });
  }

  switch (_interaction.type) {
    case InteractionTypes.APPLICATION_COMMAND: {
      const rateLimit = commandRateLimiter.acquire(_interaction.user.id);

      if (rateLimit.limited) {
        return await errorMessage({
          _context: _interaction,
          ephemeral: true,
          message: Translations[locale].GLOBAL.USER_IS_LIMITED({
            resets: formatUnix(UnixType.RELATIVE, new Date(rateLimit.expires)),
          }),
        });
      }

      rateLimit.consume();

      switch (_interaction.data.type) {
        case ApplicationCommandTypes.CHAT_INPUT: {
          await _interaction.defer().catch(() => undefined);

          await _handleChatInputSubCommand({
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
        return await errorMessage({
          _context: _interaction,
          ephemeral: true,
          message: Translations[locale].GLOBAL.USER_IS_LIMITED({
            resets: formatUnix(UnixType.RELATIVE, new Date(rateLimit.expires)),
          }),
        });
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
  const command = client.subCommands.get(`${_interaction.data.name}_${name.join("_")}`);

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
      await command.run(_interaction, {
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

  const command = client.interactions.user.get(_interaction.data.name);

  if (command?.name) {
    const result = await Result.fromAsync(async () => {
      await command.run(_interaction, {
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
  const command = client.interactions.chatInput.get(_interaction.data.name);

  if (command?.name) {
    const result = await Result.fromAsync(async () => {
      if (command.autocomplete) {
        await command.autocomplete(_interaction, {
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

  const component = client.components.buttons.get(_interaction.data.customID.split("/")[0]);

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
      await component.run(_interaction, {
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

  const component = client.components.selects.get(_interaction.data.customID.split("/")[0]);

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
      await component.run(_interaction, {
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
  const component = client.components.modals.get(_interaction.data.customID);

  if (component?.name) {
    const result = await Result.fromAsync(async () => {
      await component.run(_interaction, {
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
