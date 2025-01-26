import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  InteractionTypes,
  commandOptionsParser,
} from "@discordeno/bot";
import { inlineCode } from "@discordjs/formatters";
import { createMessage } from "@functions/createMessage.js";
import { client } from "@index";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";
import type { Interaction, MaybeOptional, Member, User } from "@types";
import type { CommandOptionsPermissions } from "@util/decorators.js";
import { i18n } from "@util/i18n.js";
import { prisma } from "@util/prisma.js";
import { match } from "ts-pattern";

/**
 * Get the required command permissions from the command instance.
 * @param command The command instance.
 * @returns The command permissions object.
 */
const getCommandPermissions = (command: ChatInputSubCommand): Partial<CommandOptionsPermissions> => {
  const { _commandOptions: options } = command;
  const { permissions } = options;

  /** If the command options do not have any permissions, return an empty object. */
  if (!permissions) {
    return {};
  }

  /**
   * If the permissions are a string, return an object with the user permission.
   * Otherwise, return the permissions object.
   */
  return typeof permissions === "string"
    ? {
        user: permissions,
      }
    : permissions;
};

/**
 * Get the sub command names from chat input commands.
 * @param interaction The interaction context.
 * @returns The sub command names.
 */
const getSubCommands = (interaction: Interaction): string[] => {
  const { data } = interaction;
  const { options } = data ?? {};
  /** Find the first sub command option from the interaction data. */
  const subCommand = options?.find((option) => option.type === ApplicationCommandOptionTypes.SubCommand);

  return subCommand ? [subCommand.name] : [];
};

/**
 * Get the parsed command options object.
 * @param interaction The interaction context.
 * @returns The parsed command options.
 */
const parsedCommandOptions = (interaction: Interaction) => {
  const { data } = interaction;
  const { options } = data ?? {};

  return commandOptionsParser(interaction, options);
};

/**
 * Get the target member from user context commands, if any.
 * @param interaction The interaction context.
 * @returns The target member.
 */
const getTargetMember = (interaction: Interaction): MaybeOptional<Member> => {
  const { data } = interaction;
  const { resolved } = data ?? {};
  const resolvedMembersCollection = resolved?.members;
  /** Target members are in the first position in the resolved members collection. */
  const targetMember = resolvedMembersCollection?.first();

  return targetMember;
};

/**
 * Get the target user from user context commands.
 * @param interaction The interaction context.
 * @returns The target user.
 */
const getTargetUser = (interaction: Interaction): User => {
  const { data } = interaction;
  const { resolved } = data ?? {};
  const resolvedUsersCollection = resolved?.users;
  /** Target users are in the first position in the resolved users collection. */
  const targetUser = resolvedUsersCollection?.first();

  /** Throw an error if the target user was not found. */
  if (!targetUser) {
    throw new Error("Cannot get target user from interaction.");
  }

  return targetUser;
};

client.events.interactionCreate = async (interaction) => {
  if (!(interaction.guildId && interaction.member)) {
    return;
  }

  const { guildId: guildIdBigInt, member } = interaction;
  const guildId = guildIdBigInt.toString();
  const clientMember = await client.fetchMember(guildIdBigInt);
  const guildConfiguration = await prisma.guildPreferences.findUnique({
    where: {
      guildId,
    },
  });
  const { locale } = {
    locale: (guildConfiguration?.locale ?? "EN").toLowerCase(),
  };
  const tCommands = i18n.getFixedT(locale, "commands");

  match(interaction).with(
    {
      type: InteractionTypes.ApplicationCommand,
    },
    (applicationCommandInteraction) => {
      if (!applicationCommandInteraction.data) {
        return;
      }

      const {
        data: { name: commandName, type: commandType },
      } = applicationCommandInteraction;

      match(commandType)
        .with(ApplicationCommandTypes.ChatInput, async () => {
          const subCommandNames = getSubCommands(applicationCommandInteraction).join("_");
          const command = client.applicationCommands.chatInput.get([commandName, subCommandNames].join("_"));

          if (command) {
            const permissions = getCommandPermissions(command);

            if (permissions) {
              const { user: userPermission } = permissions;
              const tCommon = i18n.getFixedT(locale, "common");

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
              clientMember,
              context: applicationCommandInteraction,
              options: parsedCommandOptions(applicationCommandInteraction),
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
              clientMember,
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
