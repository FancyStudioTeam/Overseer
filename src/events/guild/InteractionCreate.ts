import { client } from "@index";
import { RateLimitManager } from "@sapphire/ratelimits";
import type { MaybeNullish } from "@types";
import { CheckPermissionsFrom, checkMemberPermissions } from "@utils";
import { ApplicationCommandTypes, ChannelTypes, ComponentTypes, InteractionTypes } from "oceanic.js";
import { match } from "ts-pattern";
import {
  handleAutocomplete,
  handleButton,
  handleChatInputSubCommand,
  handleRateLimit,
  handleUserCommand,
} from "./handlers/index.js";

const commandRateLimiter = new RateLimitManager(50000, 3);
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
    isPremium: !!guildConfiguration?.premium.isEnabled,
    locale: guildConfiguration?.general.locale ?? "EN",
  };
  const clientHasMainChannelPermissions = await checkMemberPermissions(interaction.guild.clientMember, {
    channel: interaction.channel,
    context: interaction,
    locale,
    permissionsToCheck: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    type: CheckPermissionsFrom.CHANNEL,
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
        await commandInteraction.defer().catch(() => undefined);

        const collectionKeys: Record<ApplicationCommandTypes, MaybeNullish<string>> = {
          [ApplicationCommandTypes.CHAT_INPUT]: [
            commandInteraction.data.name,
            commandInteraction.data.options.getSubCommand(true).join("_"),
          ].join("_"),
          [ApplicationCommandTypes.MESSAGE]: null,
          [ApplicationCommandTypes.USER]: commandInteraction.data.name,
        };
        const collectionKey = collectionKeys[commandInteraction.data.type] ?? "";

        match(commandInteraction.data.type)
          .with(
            ApplicationCommandTypes.CHAT_INPUT,
            async () =>
              await handleChatInputSubCommand(commandInteraction, collectionKey, {
                isPremium,
                locale,
              }),
          )
          .with(
            ApplicationCommandTypes.USER,
            async () =>
              await handleUserCommand(commandInteraction, commandInteraction.data.name, {
                locale,
                isPremium,
              }),
          );
      },
    )
    .with(
      {
        type: InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE,
      },
      async (autocompleteInteraction) =>
        await handleAutocomplete(autocompleteInteraction, autocompleteInteraction.data.name, {
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

        match(componentInteraction.data.componentType).with(
          ComponentTypes.BUTTON,
          async () =>
            await handleButton(componentInteraction, collectionKey, {
              locale,
              isPremium,
              variable,
            }),
        );
      },
    )
    .otherwise(() => undefined);
});
