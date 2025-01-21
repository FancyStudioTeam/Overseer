import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  InteractionTypes,
  commandOptionsParser,
} from "@discordeno/bot";
import { client } from "@index";
import type { Interaction, MaybeOptional, Member, User } from "@types";
import { i18n } from "@util/i18n.js";
import { prisma } from "@util/prisma.js";
import { match } from "ts-pattern";

/**
 * Gets the sub command names from chat input commands.
 * @param interaction The interaction context.
 * @returns The sub command names.
 */
const getSubCommands = (interaction: Interaction): string[] => {
  const { data } = interaction;
  const { options } = data ?? {};
  const subCommand = options?.find((option) => option.type === ApplicationCommandOptionTypes.SubCommand);

  return subCommand ? [subCommand.name] : [];
};

/**
 * Gets the parsed command options object.
 * @param interaction The interaction context.
 * @returns The parsed command options.
 */
const parsedCommandOptions = (interaction: Interaction) => {
  const { data } = interaction;
  const { options } = data ?? {};

  return commandOptionsParser(interaction, options);
};

/**
 * Gets the target member from user context commands, if any.
 * @param interaction The interaction context.
 * @returns The target member.
 */
const getTargetMember = (interaction: Interaction): MaybeOptional<Member> => {
  const { data } = interaction;
  const { resolved } = data ?? {};
  const resolvedMembersCollection = resolved?.members;
  /**
   * Target members are always in the first resolved members collection position.
   */
  const targetMember = resolvedMembersCollection?.first();

  return targetMember;
};

/**
 * Gets the target user from user context commands.
 * @param interaction The interaction context.
 * @returns The target user.
 */
const getTargetUser = (interaction: Interaction): User => {
  const { data } = interaction;
  const { resolved } = data ?? {};
  const resolvedUsersCollection = resolved?.users;
  /**
   * Target users are always in the first resolved users collection position.
   */
  const targetUser = resolvedUsersCollection?.first();

  /**
   * User context commands must always include a target user.
   */
  if (!targetUser) {
    throw new Error("Cannot get target user from interaction.");
  }

  return targetUser;
};

client.events.interactionCreate = async (interaction) => {
  if (!interaction.guildId) {
    return;
  }

  const { guildId: guildIdBigInt } = interaction;
  const guildId = guildIdBigInt.toString();
  const guildConfiguration = await prisma.guildPreferences.findUnique({
    where: {
      guildId,
    },
  });
  const { locale } = {
    locale: (guildConfiguration?.locale ?? "EN").toLowerCase(),
  };
  const t = i18n.getFixedT(locale, "commands");

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
            await command.run({
              client,
              context: applicationCommandInteraction,
              options: parsedCommandOptions(applicationCommandInteraction),
              t,
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
              t,
              targetMember,
              targetUser,
            });
          }
        });
    },
  );
};
