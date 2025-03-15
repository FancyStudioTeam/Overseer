import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  InteractionTypes,
  MessageComponentTypes,
  type PermissionStrings,
  commandOptionsParser,
} from "@discordeno/bot";
import { inlineCode } from "@discordjs/formatters";
import { createMessage } from "@functions/createMessage.js";
import { parseCustomId } from "@functions/parseCustomId.js";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";
import { ModalTextInputsResolver } from "@structures/interactions/ModalTextInputsResolver.js";
import { client } from "@util/client.js";
import type { RunnableInstancePermissions } from "@util/decorators.js";
import { tCommandsFunction, tCommonFunction } from "@util/i18n.js";
import { logger } from "@util/logger.js";
import { prisma } from "@util/prisma.js";
import type { Interaction, Locales, MaybeOptional, Member, User } from "@util/types.js";
import type { TFunction } from "i18next";
import { match } from "ts-pattern";

/**
 * Gets the command or component permissions from a command or component instance.
 * @param instance - The command or component instance.
 * @returns An object containing the command or component permissions.
 */
const getPermissions = (instance: ChatInputSubCommand): Partial<RunnableInstancePermissions> => {
  const { _instanceOptions } = instance;
  const { permissions } = _instanceOptions;

  if (!permissions) {
    return {};
  }

  if (Array.isArray(permissions)) {
    return {
      user: permissions,
    };
  }

  return permissions;
};

/**
 * Checks whether the member has all the provided permissions.
 * @param member - The member object.
 * @param permissions - The permissions to check.
 * @param options - The available options.
 * @returns Whether the member has all the provided permissions.
 */
const handlePermissions = async (
  member: Member,
  permissions: PermissionStrings[],
  options: HandlePermissionsOptions,
): Promise<boolean> => {
  const { context, locale, t } = options;
  const missingPermissions: PermissionStrings[] = [];

  for (const permission of permissions) {
    if (!member.permissions?.has(permission)) {
      missingPermissions.push(permission);
    }
  }

  if (missingPermissions.length > 0) {
    /** Create a list formatter to format the permissions list correctly. */
    const listFormatter = new Intl.ListFormat(locale, {
      style: "long",
      type: "conjunction",
    });
    const translatedPermissions = missingPermissions.map((permission) =>
      inlineCode(t(`permission_keys.${permission}`)),
    );
    const formattedPermissionsList = listFormatter.format(translatedPermissions);

    await createMessage(
      context,
      t("missing_user_command_permissions", {
        /** Use the count of the missing permissions for the pluralization. */
        count: missingPermissions.length,
        permissions: formattedPermissionsList,
      }),
    );
  }

  return missingPermissions.length === 0;
};

const handleInstancePermissions = async (
  instance: ChatInputSubCommand,
  member: Member,
  options: HandlePermissionsOptions,
): Promise<boolean> => {
  const { _instanceOptions } = instance;
  const { permissions } = _instanceOptions;

  if (permissions) {
    const { client: clientPermissions, user: userPermission } = getPermissions(instance);

    if (userPermission) {
      const userHasPermissions = await handlePermissions(member, userPermission, options);

      return userHasPermissions;
    }

    if (clientPermissions) {
      const clientHasPermissions = await handlePermissions(member, clientPermissions, options);

      return clientHasPermissions;
    }
  }

  return true;
};

/**
 * Gets the sub command names from chat input commands.
 * @param interaction - The interaction context object.
 * @returns An array containing the sub command names.
 */
const getSubCommands = (interaction: Interaction): string[] => {
  const { data } = interaction;
  const { options } = data ?? {};

  /** Find the first sub command group option. */
  const subCommandGroup = options?.find((option) => option.type === ApplicationCommandOptionTypes.SubCommandGroup);

  if (subCommandGroup) {
    const { name: subCommandGroupName, options } = subCommandGroup;
    /** Find the first sub command option from the sub command group options. */
    const subCommand = options?.find((option) => option.type === ApplicationCommandOptionTypes.SubCommand);

    return subCommand ? [subCommandGroupName, subCommand.name] : [];
  }

  /** Find the first sub command option. */
  const subCommand = options?.find((option) => option.type === ApplicationCommandOptionTypes.SubCommand);

  return subCommand ? [subCommand.name] : [];
};

/**
 * Gets the parsed command options object.
 * @param interaction - The interaction context object.
 * @returns - An object containing the parsed command options.
 */
const parseCommandOptions = (interaction: Interaction) => {
  const { data } = interaction;
  const { options } = data ?? {};

  return commandOptionsParser(interaction, options);
};

/**
 * Gets the target member from a user context command, if any.
 * @param interaction - The interaction context object.
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
 * @param interaction - The interaction context object.
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
  const { data, guildId: guildIdBigInt, member } = interaction;

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

  if (!data) {
    throw new Error("Cannot retreive data from interaction.");
  }

  match(interaction)
    .with(
      {
        type: InteractionTypes.ApplicationCommand,
      },
      (applicationCommandInteraction) => {
        const { name: commandName, type: commandType } = data;
        const { applicationCommands } = client;
        const { chatInput: chatInputCommands, userContext: userContextCommands } = applicationCommands;

        match(commandType)
          .with(ApplicationCommandTypes.ChatInput, async () => {
            const subCommandNames = getSubCommands(applicationCommandInteraction).join("_");
            const command = chatInputCommands.get(`${commandName}_${subCommandNames}`);

            if (!command) {
              return logger.warn(`Cannot find chat input command with name "${commandName}".`);
            }

            const permissionsWereApproved = await handleInstancePermissions(command, member, {
              context: applicationCommandInteraction,
              locale,
              t: tCommon,
            });

            if (!permissionsWereApproved) {
              return;
            }

            await command._run({
              client,
              context: applicationCommandInteraction,
              options: parseCommandOptions(applicationCommandInteraction),
              t: tCommands,
            });
          })
          .with(ApplicationCommandTypes.User, async () => {
            const command = userContextCommands.get(commandName);
            const targetMember = getTargetMember(applicationCommandInteraction);
            const targetUser = getTargetUser(applicationCommandInteraction);

            if (!command) {
              return logger.warn(`Cannot find user context command with name "${commandName}".`);
            }

            await command._run({
              client,
              context: applicationCommandInteraction,
              t: tCommands,
              targetMember,
              targetUser,
            });
          });
      },
    )
    .with(
      {
        type: InteractionTypes.MessageComponent,
      },
      (messageComponentInteraction) => {
        const { customId: componentCustomId, componentType } = data;

        if (!componentCustomId) {
          throw new Error("Cannot execute this message component without a custom id.");
        }

        const { customId, values } = parseCustomId(componentCustomId);
        const { components } = client;
        const { buttons, selectMenus } = components;

        match(componentType)
          .with(MessageComponentTypes.Button, async () => {
            const component = buttons.get(customId);

            if (!component) {
              return logger.warn(`Cannot find button component with custom id "${customId}".`);
            }

            await component._run({
              client,
              context: messageComponentInteraction,
              t: tCommands,
              values,
            });
          })
          .when(
            (componentType) =>
              componentType &&
              [
                MessageComponentTypes.SelectMenu,
                MessageComponentTypes.SelectMenuChannels,
                MessageComponentTypes.SelectMenuRoles,
                MessageComponentTypes.SelectMenuUsers,
                MessageComponentTypes.SelectMenuUsersAndRoles,
              ].includes(componentType),
            async () => {
              const component = selectMenus.get(customId);

              if (!component) {
                return logger.warn(`Cannot find select menu component with custom id "${customId}".`);
              }

              await component._run({
                client,
                context: messageComponentInteraction,
                t: tCommands,
                values,
              });
            },
          );
      },
    )
    .with(
      {
        type: InteractionTypes.ModalSubmit,
      },
      async (modalSubmitInteraction) => {
        const { customId: modalCustomId } = data;

        if (!modalCustomId) {
          throw new Error("Cannot execute this modal without a custom id.");
        }

        const { customId, values } = parseCustomId(modalCustomId);
        const { components } = client;
        const { modals } = components;
        const component = modals.get(customId);
        const modalTextInputsResolver = new ModalTextInputsResolver(modalSubmitInteraction);

        if (component) {
          await component._run({
            client,
            context: modalSubmitInteraction,
            t: tCommands,
            textInputsResolver: modalTextInputsResolver,
            values,
          });
        }
      },
    );
};

interface HandlePermissionsOptions {
  /** The interaction context object. */
  context: Interaction;
  /** The guild locale. */
  locale: Locales;
  /** The function to translate the common messages. */
  t: TFunction<"common">;
}
