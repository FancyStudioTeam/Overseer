import { client } from "@index";
import { RateLimitManager } from "@sapphire/ratelimits";
import { checkChannelMemberPermissions } from "@utils";
import { noop } from "es-toolkit";
import { ApplicationCommandTypes, ChannelTypes, ComponentTypes, InteractionTypes } from "oceanic.js";
import { match } from "ts-pattern";
import {
  handleAutoComplete,
  handleButton,
  handleChatInputSubCommand,
  handleMessageCommand,
  handleRateLimit,
  handleSelectMenu,
  handleUserCommand,
} from "./handlers/index.js";

const commandRateLimiter = new RateLimitManager(5000, 3);
const componentRateLimiter = new RateLimitManager(7000, 5);

client.on("interactionCreate", async (interaction) => {
  if (!(interaction.inCachedGuildChannel() && interaction.guild)) return;
  if (!interaction.channel) return;
  if (interaction.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (interaction.user.bot) return;

  const guildConfiguration = await client.prisma.guildConfiguration.findUnique({
    where: {
      guildId: interaction.guildID,
    },
  });
  const { isPremium, locale } = {
    isPremium: await client.isGuildMembershipActive(interaction.guildID, {
      isEnabled: !!guildConfiguration?.premium.isEnabled,
      expiresAt: guildConfiguration?.premium.expiresAt ?? null,
    }),
    locale: guildConfiguration?.general.locale ?? "EN",
  };
  const clientHasMainChannelPermissions = await checkChannelMemberPermissions(interaction.guild.clientMember, {
    channel: interaction.channel,
    context: interaction,
    locale,
    permissionsToCheck: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
  });

  if (!clientHasMainChannelPermissions) return;

  if (interaction.isCommandInteraction() || interaction.isComponentInteraction()) {
    const rateLimiters: Record<
      InteractionTypes.APPLICATION_COMMAND | InteractionTypes.MESSAGE_COMPONENT,
      RateLimitManager
    > = {
      [InteractionTypes.APPLICATION_COMMAND]: commandRateLimiter,
      [InteractionTypes.MESSAGE_COMPONENT]: componentRateLimiter,
    };
    const rateLimiter = rateLimiters[interaction.type];
    const isRateLimited = await handleRateLimit(interaction, rateLimiter, {
      locale,
    });

    if (isRateLimited) return;
  }

  return match(interaction)
    .with(
      {
        type: InteractionTypes.APPLICATION_COMMAND,
      },
      async (commandInteraction) => {
        await commandInteraction.defer().catch(noop);

        match(commandInteraction.data.type)
          .with(ApplicationCommandTypes.CHAT_INPUT, async () => {
            const collectionKey = [
              commandInteraction.data.name,
              commandInteraction.data.options.getSubCommand(true).join("_"),
            ].join("_");

            await handleChatInputSubCommand(commandInteraction, collectionKey, {
              isPremium,
              locale,
            });
          })
          .with(ApplicationCommandTypes.MESSAGE, async () => {
            const collectionKey = commandInteraction.data.name;

            await handleMessageCommand(commandInteraction, collectionKey, {
              isPremium,
              locale,
            });
          })
          .with(ApplicationCommandTypes.USER, async () => {
            const collectionKey = commandInteraction.data.name;

            await handleUserCommand(commandInteraction, collectionKey, {
              isPremium,
              locale,
            });
          });
      },
    )
    .with(
      {
        type: InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE,
      },
      async (autocompleteInteraction) =>
        await handleAutoComplete(autocompleteInteraction, autocompleteInteraction.data.name, {
          isPremium,
          locale,
        }),
    )
    .with(
      {
        type: InteractionTypes.MESSAGE_COMPONENT,
      },
      (componentInteraction) => {
        const [collectionKey, variable] = componentInteraction.data.customID.split("#");

        match(componentInteraction.data.componentType)
          .with(
            ComponentTypes.BUTTON,
            async () =>
              await handleButton(componentInteraction, collectionKey, {
                locale,
                isPremium,
                variable,
              }),
          )
          .with(
            ComponentTypes.STRING_SELECT,
            async () =>
              await handleSelectMenu(componentInteraction, collectionKey, {
                isPremium,
                locale,
                variable,
              }),
          );
      },
    )
    .otherwise(noop);
});
