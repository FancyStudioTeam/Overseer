import { RateLimitManager } from "@sapphire/ratelimits";
import { ApplicationCommandTypes, ChannelTypes, ComponentTypes, InteractionTypes } from "oceanic.js";
import { match } from "ts-pattern";
import { client } from "#index";
import { Translations } from "#translations";
import type { Locales } from "#types";
import { prisma } from "#util/Prisma.js";
import { CheckPermissionsFrom, checkMemberPermissions, errorMessage, formatUnix } from "#util/Util.js";
import { handleButton } from "./handlers/handleButton";
import { handleChatInputSubCommand } from "./handlers/handleChatInputSubCommand";
import { handleUserCommand } from "./handlers/handleUserCommand";

const commandRateLimiter = new RateLimitManager(5000, 3);
const componentRateLimiter = new RateLimitManager(7000, 5);

client.on("interactionCreate", async (interaction) => {
  if (!(interaction.inCachedGuildChannel() && interaction.guild)) return;
  if (!interaction.channel) return;
  if (interaction.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (interaction.user.bot) return;

  const guildConfiguration = await prisma.guildConfiguration.findUnique({
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
          return await errorMessage(
            Translations[locale].GLOBAL.USER_IS_LIMITED({
              resets: formatUnix(new Date(rateLimit.expires)),
            }),
            {
              context: interaction,
            },
          );
        }

        rateLimit.consume();

        return match(commandInteraction.data.type)
          .with(
            ApplicationCommandTypes.CHAT_INPUT,
            async () =>
              await handleChatInputSubCommand(commandInteraction.data.options.getSubCommand(true).join("_"), {
                handleArguments: {
                  locale,
                  premium,
                },
                context: commandInteraction,
              }),
          )
          .with(
            ApplicationCommandTypes.USER,
            async () =>
              await handleUserCommand(commandInteraction.data.name, {
                handleArguments: {
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
          return await errorMessage(
            Translations[locale].GLOBAL.USER_IS_LIMITED({
              resets: formatUnix(new Date(rateLimit.expires)),
            }),
            {
              context: interaction,
            },
          );
        }

        rateLimit.consume();

        return match(componentInteraction.data.componentType).with(ComponentTypes.BUTTON, async () => {
          await handleButton(componentInteraction.data.customID.split("#")[0], {
            handleArguments: {
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
