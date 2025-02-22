import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  InteractionTypes,
  commandOptionsParser,
} from "@discordeno/bot";
import { inlineCode } from "@discordjs/formatters";
import { createMessage } from "@functions/createMessage.js";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";
import { client } from "@util/client.js";
import type { CommandOptionsPermissions } from "@util/decorators.js";
import { tCommandsFunction, tCommonFunction } from "@util/i18n.js";
import { prisma } from "@util/prisma.js";
import type { Interaction, MaybeOptional, Member, User } from "@util/types.js";
import { match } from "ts-pattern";

/**
 * Gets the command or component permissions from a command or component instance.
 * @param instance - The command or component instance.
 * @returns An object containing the command or component permissions.
 */
const getPermissions = (instance: ChatInputSubCommand): Partial<CommandOptionsPermissions> => {
  const { _options: options } = instance;
  const { permissions } = options;

  if (!permissions) {
    return {};
  }

  /**
   * If the permissions are a string, return an object containing the user permissions.
   * Otherwise, return the permissions object.
   */
  return typeof permissions === "string"
    ? {
        user: permissions,
      }
    : permissions;
};

/**
 * Gets the sub command names from chat input commands.
 * @param interaction - The interaction context.
 * @returns An array containing the sub command names.
 */
const getSubCommands = (interaction: Interaction): string[] => {
  const { data } = interaction;
  const { options } = data ?? {};
  /** Find the first sub command option from the interaction data. */
  const subCommand = options?.find((option) => option.type === ApplicationCommandOptionTypes.SubCommand);

  return subCommand ? [subCommand.name] : [];
};

/**
 * Gets the parsed command options object.
 * @param interaction - The interaction context.
 * @returns - An object containing the parsed command options.
 */
const parseCommandOptions = (interaction: Interaction) => {
  const { data } = interaction;
  const { options } = data ?? {};

  return commandOptionsParser(interaction, options);
};

/**
 * Gets the target member from a user context command, if any.
 * @param interaction - The interaction context.
 * @returns The target member object or undefined.
 */
const getTargetMember = (interaction: Interaction): MaybeOptional<Member> => {
  const { data } = interaction;
  const { resolved } = data ?? {};
  const resolvedMembersCollection = resolved?.members;
  /**
   * Target members are always in the first position in the collection.
   * They do not have a key to access them.
   */
  const targetMember = resolvedMembersCollection?.first();

  return targetMember;
};

/**
 * Gets the target user from a user context command.
 * @param interaction - The interaction context.
 * @returns The target user object.
 */
const getTargetUser = (interaction: Interaction): User => {
  const { data } = interaction;
  const { resolved } = data ?? {};
  const resolvedUsersCollection = resolved?.users;
  /**
   * Target users are always in the first position in the collection.
   * They do not have a key to access them.
   */
  const targetUser = resolvedUsersCollection?.first();

  if (!targetUser) {
    throw new Error("Cannot get target user from interaction.");
  }

  return targetUser;
};

client.events.interactionCreate = async (interaction) => {
  const { guildId: guildIdBigInt, member } = interaction;

  if (!(guildIdBigInt && member)) {
    return;
  }

  const guildId = guildIdBigInt.toString();
  const guildConfiguration = await prisma.guildPreferences.findUnique({
    where: {
      guildId,
    },
  });
  const { locale } = {
    locale: guildConfiguration?.locale ?? "EN",
  };
  const tCommands = tCommandsFunction(locale);
  const tCommon = tCommonFunction(locale);

  match(interaction).with(
    {
      type: InteractionTypes.ApplicationCommand,
    },
    (applicationCommandInteraction) => {
      const { data } = applicationCommandInteraction;

      if (!data) {
        return;
      }

      const { name: commandName, type: commandType } = data;

      match(commandType)
        .with(ApplicationCommandTypes.ChatInput, async () => {
          const subCommandNames = getSubCommands(applicationCommandInteraction).join("_");
          const command = client.applicationCommands.chatInput.get(`${commandName}_${subCommandNames}`);

          if (command) {
            const permissions = getPermissions(command);

            if (permissions) {
              const { user: userPermission } = permissions;

              if (userPermission && !member.permissions?.has(userPermission)) {
                return createMessage(
                  applicationCommandInteraction,
                  tCommon("missing_user_command_permissions", {
                    permissions: inlineCode(tCommon(`permission_keys.${userPermission}`)),
                  }),
                );
              }
            }

            await command.run({
              client,
              context: applicationCommandInteraction,
              options: parseCommandOptions(applicationCommandInteraction),
              t: tCommands,
            });
          }
        })
        .with(ApplicationCommandTypes.User, async () => {
          const command = client.applicationCommands.user.get(commandName);
          const targetMember = getTargetMember(applicationCommandInteraction);
          const targetUser = getTargetUser(applicationCommandInteraction);

          if (command) {
            await command.run({
              client,
              context: applicationCommandInteraction,
              t: tCommands,
              targetMember,
              targetUser,
            });
          }
        });
    },
  );
};
