import { ApplicationCommandOptionTypes, ApplicationCommandTypes, InteractionTypes } from "@discordeno/bot";
import { client } from "@index";
import type { Interaction, MaybeNullish, Member, User } from "@types";
import { i18n } from "@util/i18n.js";
import { prisma } from "@util/prisma.js";
import { match } from "ts-pattern";

/**
 * Gets the target member from user context command interaction.
 */
const getTargetMember = (interaction: Interaction): MaybeNullish<Member> => {
  if (!interaction.data) {
    throw new Error("Unable to get interaction data");
  }

  const {
    data: { resolved },
  } = interaction;
  const resolvedMembersCollection = resolved?.members;

  if (!resolvedMembersCollection) {
    throw new Error("Unable to get resolved users collection");
  }

  const targetMember = resolvedMembersCollection.first();

  return targetMember;
};

/**
 * Gets the target user from user context command interaction.
 */
const getTargetUser = (interaction: Interaction): User => {
  if (!interaction.data) {
    throw new Error("Unable to get interaction data");
  }

  const {
    data: { resolved },
  } = interaction;
  const resolvedUsersCollection = resolved?.users;

  if (!resolvedUsersCollection) {
    throw new Error("Unable to get resolved users collection");
  }

  /**
   * Target user is always in the first collection position in the resolved users collection.
   */
  const targetUser = resolvedUsersCollection.first();

  if (!targetUser) {
    throw new Error("Unable to get target user");
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
  const t = i18n.getFixedT(locale);

  match(interaction).with(
    {
      type: InteractionTypes.ApplicationCommand,
    },
    (applicationCommandInteraction) => {
      if (!applicationCommandInteraction.data) {
        return;
      }

      const {
        data: { name: commandName, options: commandOptions, type: commandType },
      } = applicationCommandInteraction;

      match(commandType)
        .with(ApplicationCommandTypes.ChatInput, async () => {
          const subCommands = commandOptions?.filter(
            (option) => option.type === ApplicationCommandOptionTypes.SubCommand,
          );
          const subCommand = subCommands?.[0];
          const command = client.applicationCommands.chatInput.get([commandName, subCommand?.name].join("_"));

          if (command) {
            await command.run({
              client,
              context: applicationCommandInteraction,
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
