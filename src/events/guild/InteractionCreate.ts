import { client } from "@index";
import { RateLimitManager } from "@sapphire/ratelimits";
import { Translations } from "@translations";
import type { Locales } from "@types";
import { CheckPermissionsFrom, checkMemberPermissions, createErrorMessage, formatUnix } from "@utils";
import { ApplicationCommandTypes, ChannelTypes, ComponentTypes, InteractionTypes } from "oceanic.js";
import { match } from "ts-pattern";
import { handleButton } from "./handlers/handleButton.js";
import { handleChatInputSubCommand } from "./handlers/handleChatInputSubCommand.js";
import { handleUserCommand } from "./handlers/handleUserCommand.js";

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
  const locale = (guildConfiguration?.general.locale ?? "EN") as Locales;
  const premium = guildConfiguration?.premium.enabled ?? false;
  const clientHasMainChannelPermissions = await checkMemberPermissions(interaction.guild.clientMember, {
    channel: interaction.channel,
    context: interaction,
    locale,
    permissionsToCheck: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    type: CheckPermissionsFrom.CHANNEL,
  });

  if (!clientHasMainChannelPermissions) return;

  match(interaction)
    .with(
      {
        type: InteractionTypes.APPLICATION_COMMAND,
      },
      async (commandInteraction) => {
        await commandInteraction.defer().catch(() => undefined);

        const rateLimit = commandRateLimiter.acquire(interaction.user.id);

        if (rateLimit.limited) {
          return await createErrorMessage(interaction, {
            content: Translations[locale].GLOBAL.USER_IS_LIMITED({
              resets: formatUnix(new Date(rateLimit.expires)),
            }),
          });
        }

        rateLimit.consume();

        return match(commandInteraction.data.type)
          .with(
            ApplicationCommandTypes.CHAT_INPUT,
            async () =>
              await handleChatInputSubCommand(
                [commandInteraction.data.name, commandInteraction.data.options.getSubCommand(true).join("_")].join("_"),
                {
                  handleArguments: {
                    client,
                    locale,
                    premium,
                  },
                  context: commandInteraction,
                },
              ),
          )
          .with(
            ApplicationCommandTypes.USER,
            async () =>
              await handleUserCommand(commandInteraction.data.name, {
                handleArguments: {
                  client,
                  locale,
                  premium,
                },
                context: commandInteraction,
              }),
          );
      },
    )
    .with(
      {
        type: InteractionTypes.MESSAGE_COMPONENT,
      },
      async (componentInteraction) => {
        const rateLimit = componentRateLimiter.acquire(interaction.user.id);

        if (rateLimit.limited) {
          return await createErrorMessage(interaction, {
            content: Translations[locale].GLOBAL.USER_IS_LIMITED({
              resets: formatUnix(new Date(rateLimit.expires)),
            }),
          });
        }

        rateLimit.consume();

        return match(componentInteraction.data.componentType).with(ComponentTypes.BUTTON, async () => {
          await handleButton(componentInteraction.data.customID.split("#")[0], {
            handleArguments: {
              client,
              locale,
              premium,
              variable: componentInteraction.data.customID.split("#")[1],
            },
            context: componentInteraction,
          });
        });
      },
    )
    .otherwise(() => undefined);
});
