import { RateLimitManager } from "@sapphire/ratelimits";
import { Result } from "@sapphire/result";
import {
  ApplicationCommandTypes,
  ChannelTypes,
  type Collection,
  type CommandInteraction,
  InteractionTypes,
} from "oceanic.js";
import { match } from "ts-pattern";
import { client } from "#index";
import { Translations } from "#translations";
import type { MaybeNullish } from "#types";
import type { Locales } from "#types";
import type { createChatInputCommand, createChatInputSubCommand, createUserCommand } from "#util/Handlers";
import { prisma } from "#util/Prisma.js";
import { CheckPermissionsFrom, checkMemberPermissions, errorMessage, formatUnix, handleError } from "#util/Util.js";

const commandRateLimiter = new RateLimitManager(5000, 3);
const handle = async <
  C extends
    | Parameters<typeof createChatInputCommand>[0]
    | Parameters<typeof createChatInputSubCommand>[0]
    | Parameters<typeof createUserCommand>[0],
>(
  key: string,
  {
    handleArguments,
    collection,
    context,
  }: {
    handleArguments: {
      locale: Locales;
      premium: boolean;
      variable?: unknown;
    };
    collection: Collection<string, MaybeNullish<C>>;
    context: CommandInteraction;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;

  const data = collection.get(key);
  const { locale } = handleArguments;

  if (data) {
    if ("permissions" in data) {
      if (data.permissions?.user) {
        const userHasCommandPermissions = await checkMemberPermissions(context.member, {
          context,
          locale,
          permissionsToCheck: data.permissions.user,
        });

        if (!userHasCommandPermissions) return;
      }

      if (data.permissions?.bot) {
        const clientHasCommandPermissions = await checkMemberPermissions(context.guild.clientMember, {
          context,
          locale,
          permissionsToCheck: data.permissions.bot,
        });

        if (!clientHasCommandPermissions) return;
      }
    }

    if ("run" in data) {
      const result = await Result.fromAsync(
        async () =>
          await data.run({
            ...handleArguments,
            context,
          }),
      );

      result.unwrapOrElse(
        async (error) =>
          await handleError(error, {
            context,
          }),
      );
    }
  }
};

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
          .with(ApplicationCommandTypes.CHAT_INPUT, async () => {
            const subCommand = commandInteraction.data.options.getSubCommand(true).join("_");

            await handle<Parameters<typeof createChatInputSubCommand>[0]>(
              `${commandInteraction.data.name}_${subCommand}`,
              {
                handleArguments: {
                  locale,
                  premium,
                },
                collection: client.subCommands,
                context: commandInteraction,
              },
            );
          })
          .with(
            ApplicationCommandTypes.USER,
            async () =>
              await handle<Parameters<typeof createUserCommand>[0]>(commandInteraction.data.name, {
                handleArguments: {
                  locale,
                  premium,
                },
                collection: client.interactions.user,
                context: commandInteraction,
              }),
          );
      },
    )
    .otherwise(() => undefined);
});
