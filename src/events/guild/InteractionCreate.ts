import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RateLimitManager } from "@sapphire/ratelimits";
import { Result } from "@sapphire/result";
import { ActionRow, Attachment, Button, Embed } from "oceanic-builders";
import {
  ApplicationCommandTypes,
  type AutocompleteInteraction,
  ButtonStyles,
  ChannelTypes,
  type CommandInteraction,
  InteractionTypes,
  MessageFlags,
} from "oceanic.js";
import { Colors, Emojis, Links } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import { CheckPermissionsFrom, type Locales } from "#types";
import { prisma } from "#util/Prisma.js";
import { UnixType, checkMemberPermissions, errorMessage, formatUnix, handleError, parseEmoji } from "#util/Util.js";

const commandRateLimiter = new RateLimitManager(5000, 3);
// const componentRateLimiter = new RateLimitManager(7000, 5);

client.on("interactionCreate", async (interaction) => {
  if (!(interaction.inCachedGuildChannel() && interaction.guild)) return;
  if (!interaction.channel) return;
  if (interaction.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (interaction.user.bot) return;

  const guildConfiguration = await prisma.guildConfiguration.findUnique({
    where: {
      guildID: interaction.guildID,
    },
  });
  const locale = (guildConfiguration?.general.locale ?? "EN") as Locales;
  const timezone = guildConfiguration?.general.timezone ?? "UTC";
  const hour12 = guildConfiguration?.general.use12Hours ?? false;
  const premium = guildConfiguration?.premium.enabled ?? false;
  const clientHasMainChannelPermissions = await checkMemberPermissions(interaction.guild.clientMember, {
    channel: interaction.channel,
    context: interaction,
    locale,
    permissionsToCheck: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    type: CheckPermissionsFrom.CHANNEL,
  });

  if (!clientHasMainChannelPermissions) return;

  if (process.env.NODE_ENV === "maintenance" && "reply" in interaction) {
    return await interaction.reply({
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

  switch (interaction.type) {
    case InteractionTypes.APPLICATION_COMMAND: {
      const rateLimit = commandRateLimiter.acquire(interaction.user.id);

      if (rateLimit.limited) {
        return await errorMessage({
          context: interaction,
          message: Translations[locale].GLOBAL.USER_IS_LIMITED({
            resets: formatUnix({
              date: new Date(rateLimit.expires),
              type: UnixType.RELATIVE,
            }),
          }),
        });
      }

      rateLimit.consume();

      switch (interaction.data.type) {
        case ApplicationCommandTypes.CHAT_INPUT: {
          await interaction.defer().catch(() => undefined);

          await handleChatInputSubCommand({
            interaction,
            locale,
            timezone,
            hour12,
            premium,
          });

          break;
        }
        case ApplicationCommandTypes.USER: {
          await handleUserCommand({
            interaction,
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
      await handleAutocomplete({
        interaction,
        locale,
        timezone,
        hour12,
        premium,
      });

      break;
    }
    /*case InteractionTypes.MESSAGE_COMPONENT: {
      const rateLimit = componentRateLimiter.acquire(interaction.user.id);

      if (rateLimit.limited) {
        return await errorMessage({
          context: interaction,
          message: Translations[locale].GLOBAL.USER_IS_LIMITED({
            resets: formatUnix({
              date: new Date(rateLimit.expires),
              type: UnixType.RELATIVE,
            }),
          }),
        });
      }

      rateLimit.consume();

      switch (interaction.data.componentType) {
        case ComponentTypes.BUTTON: {
          await handleButton({
            interaction,
            locale,
            timezone,
            hour12,
            premium,
          });

          break;
        }
        case ComponentTypes.STRING_SELECT: {
          await handleSelectMenu({
            interaction,
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
      await handleModalSubmit({
        interaction,
        locale,
        timezone,
        hour12,
        premium,
      });

      break;
    }*/
  }
});

async function handleChatInputSubCommand({
  interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  interaction: CommandInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(interaction.inCachedGuildChannel() && interaction.guild)) return;

  const name = interaction.data.options.getSubCommand(true);
  const command = client.subCommands.get(`${interaction.data.name}_${name.join("_")}`);

  if (command?.name) {
    if (command.permissions?.user) {
      const userHasCommandPermissions = await checkMemberPermissions(interaction.member, {
        context: interaction,
        locale,
        permissionsToCheck: command.permissions.user,
      });

      if (!userHasCommandPermissions) return;
    }

    if (command.permissions?.bot) {
      const clientHasCommandPermissions = await checkMemberPermissions(interaction.guild.clientMember, {
        context: interaction,
        locale,
        permissionsToCheck: command.permissions.bot,
      });

      if (!clientHasCommandPermissions) return;
    }

    const result = await Result.fromAsync(async () => {
      await command.run({
        context: interaction,
        locale,
        timezone,
        hour12,
        premium,
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError({
        context: interaction,
        locale,
        error,
      });
    });
  }
}

async function handleUserCommand({
  interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  interaction: CommandInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(interaction.inCachedGuildChannel() && interaction.guild)) return;

  const command = client.interactions.user.get(interaction.data.name);

  if (command?.name) {
    const result = await Result.fromAsync(async () => {
      await command.run({
        context: interaction,
        locale,
        timezone,
        hour12,
        premium,
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError({
        context: interaction,
        locale,
        error,
      });
    });
  }
}

async function handleAutocomplete({
  interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  interaction: AutocompleteInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  const command = client.interactions.chatInput.get(interaction.data.name);

  if (command?.name) {
    const result = await Result.fromAsync(async () => {
      if (command.autocomplete) {
        await command.autocomplete({
          context: interaction,
          locale,
          timezone,
          hour12,
          premium,
        });
      }
    });

    result.unwrapOrElse(async (error) => {
      await handleError({
        context: interaction,
        locale,
        error,
      });
    });
  }
}

/*async function handleButton({
  interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  interaction: ComponentInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(interaction.inCachedGuildChannel() && interaction.guild)) return;

  const component = client.components.buttons.get(interaction.data.customID.split("#")[0]);

  if (component?.name) {
    if (component.permissions?.user) {
      const userHasComponentPermissions = await checkMemberPermissions(interaction.member, {
        context: interaction,
        locale,
        permissionsToCheck: component.permissions.user,
      });

      if (!userHasComponentPermissions) return;
    }

    if (component.permissions?.bot) {
      const clientHasComponentPermissions = await checkMemberPermissions(interaction.guild.clientMember, {
        context: interaction,
        locale,
        permissionsToCheck: component.permissions.bot,
      });

      if (!clientHasComponentPermissions) return;
    }

    const result = await Result.fromAsync(async () => {
      await component.run({
        context: interaction,
        locale,
        timezone,
        hour12,
        premium,
        variable: interaction.data.customID.split("/")[1] ?? "",
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError({
        context: interaction,
        locale,
        error,
      });
    });
  }
}

async function handleSelectMenu({
  interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  interaction: ComponentInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  if (!(interaction.inCachedGuildChannel() && interaction.guild)) return;

  const component = client.components.selects.get(interaction.data.customID.split("/")[0]);

  if (component?.name) {
    if (component.permissions?.user) {
      const userHasComponentPermissions = await checkMemberPermissions(interaction.member, {
        context: interaction,
        locale,
        permissionsToCheck: component.permissions.user,
      });

      if (!userHasComponentPermissions) return;
    }

    if (component.permissions?.bot) {
      const clientHasComponentPermissions = await checkMemberPermissions(interaction.guild.clientMember, {
        context: interaction,
        locale,
        permissionsToCheck: component.permissions.bot,
      });

      if (!clientHasComponentPermissions) return;
    }

    const result = await Result.fromAsync(async () => {
      await component.run({
        context: interaction,
        locale,
        timezone,
        hour12,
        premium,
        variable: interaction.data.customID.split("/")[1] ?? "",
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError({
        context: interaction,
        locale,
        error,
      });
    });
  }
}

async function handleModalSubmit({
  interaction,
  locale,
  timezone,
  hour12,
  premium,
}: {
  interaction: ModalSubmitInteraction;
  locale: Locales;
  timezone: string;
  hour12: boolean;
  premium: boolean;
}): Promise<void> {
  const component = client.components.modals.get(interaction.data.customID);

  if (component?.name) {
    const result = await Result.fromAsync(async () => {
      await component.run({
        context: interaction,
        locale,
        timezone,
        hour12,
        premium,
      });
    });

    result.unwrapOrElse(async (error) => {
      await handleError({
        context: interaction,
        locale,
        error,
      });
    });
  }
}*/
