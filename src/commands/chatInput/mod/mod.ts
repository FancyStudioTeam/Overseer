import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type AutocompleteInteraction,
  ChannelTypes,
} from "oceanic.js";
import { ChatInputCommand } from "../../../classes/Builders";
import { prisma } from "../../../util/db";

export default new ChatInputCommand({
  name: "mod",
  description: "-",
  options: [
    {
      name: "ban",
      description: "Bans a user",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "user",
          description: "User mention or ID",
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: "reason",
          description: "Ban reason",
          type: ApplicationCommandOptionTypes.STRING,
          required: false,
        },
      ],
    },
    {
      name: "kick",
      description: "Kicks a user",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "user",
          description: "User mention or ID",
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: "reason",
          description: "Kick reason",
          type: ApplicationCommandOptionTypes.STRING,
          required: false,
        },
      ],
    },
    {
      name: "purge",
      description: "Removes messages from a channel",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "amount",
          description: "Amount of messages",
          type: ApplicationCommandOptionTypes.INTEGER,
          required: true,
          minValue: 2,
          maxValue: 100,
        },
        {
          name: "channel",
          description: "Channel mention or ID",
          type: ApplicationCommandOptionTypes.CHANNEL,
          required: false,
          channelTypes: [ChannelTypes.GUILD_TEXT],
        },
      ],
    },
    {
      name: "slowmode",
      description: "Adds a timeout to a channel",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "duration",
          description: "Duration in days / hours / minutes / seconds",
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
        },
        {
          name: "channel",
          description: "Channel mention",
          type: ApplicationCommandOptionTypes.CHANNEL,
          required: false,
          channelTypes: [ChannelTypes.GUILD_TEXT],
        },
      ],
    },
    {
      name: "timeout",
      description: "Adds a timeout to a user",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "user",
          description: "User mention or ID",
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: "duration",
          description: "Duration in days / hours / minutes / seconds",
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
        },
        {
          name: "reason",
          description: "Timeout reason",
          type: ApplicationCommandOptionTypes.STRING,
          required: false,
          maxLength: 35,
        },
      ],
    },
    {
      name: "warn",
      description: "-",
      type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
      options: [
        {
          name: "add",
          description: "Warns a user",
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          options: [
            {
              name: "user",
              description: "User mention or ID",
              type: ApplicationCommandOptionTypes.USER,
              required: true,
            },
            {
              name: "reason",
              description: "Warning reason",
              type: ApplicationCommandOptionTypes.STRING,
              required: false,
              maxLength: 35,
            },
          ],
        },
        {
          name: "remove",
          description: "Removes a user's warning",
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          options: [
            {
              name: "user",
              description: "User mention or ID",
              type: ApplicationCommandOptionTypes.USER,
              required: true,
            },
            {
              name: "warning",
              description: "Warning ID",
              type: ApplicationCommandOptionTypes.STRING,
              required: true,
              autocomplete: true,
            },
          ],
        },
        {
          name: "list",
          description: "Displays a user's warnings",
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          options: [
            {
              name: "user",
              description: "User mention or ID",
              type: ApplicationCommandOptionTypes.USER,
              required: false,
            },
          ],
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "moderation",
  autocomplete: async (interaction: AutocompleteInteraction) => {
    const subcommand = interaction.data.options.getSubCommand(true);

    switch (subcommand.join("_")) {
      case "warn_remove": {
        const availableChoices: string[] = [];
        const focusedValue = interaction.data.options.getFocused(true);
        const user = interaction.data.options.getUserOption("user");
        const warningValues = await prisma.userWarn.findMany({
          where: {
            user_id: user?.value,
            guild_id: interaction.guild?.id,
          },
        });

        search(
          focusedValue.value as string,
          warningValues.map((w) => w.warn_id),
        );

        function search(query: string, allChoices: string[]) {
          const newQuery = query.toLowerCase();

          for (let i = 0; i < allChoices.length; i++) {
            if (allChoices[i].toLowerCase().includes(newQuery)) {
              availableChoices.push(allChoices[i]);
            }
          }

          return availableChoices;
        }

        await interaction.result(
          availableChoices.slice(0, 25).map((c) => {
            return {
              name: `Delete warn with ID ${c}`,
              value: c,
            };
          }),
        );

        break;
      }
    }
  },
});
