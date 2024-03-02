import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type AutocompleteInteraction,
  ChannelTypes,
  type InteractionOptionsString,
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
          maxLength: 35,
        },
        {
          name: "delete_messages",
          description: "Select one of the options",
          type: ApplicationCommandOptionTypes.NUMBER,
          choices: [
            {
              name: "Do not delete messages",
              value: 0,
            },
            {
              name: "Last hour",
              value: 3600,
            },
            {
              name: "Last 6 hours",
              value: 21600,
            },
            {
              name: "Last 12 hours",
              value: 43200,
            },
            {
              name: "Last 24 hours",
              value: 86400,
            },
            {
              name: "Last 3 days",
              value: 259200,
            },
            {
              name: "Last 7 days",
              value: 604800,
            },
          ],
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
          maxLength: 35,
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
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return interaction.result([
        {
          name: "Unable to obtain the server from the interaction",
          value: "",
        },
      ]);
    }

    const subcommand = interaction.data.options.getSubCommand(true);

    switch (subcommand.join("_")) {
      case "warn_remove": {
        const availableChoices: string[] = [];
        const focusedValue =
          interaction.data.options.getFocused<InteractionOptionsString>(true);
        const user = interaction.data.options.getUserOption("user");

        if (!user) {
          return interaction.result([
            {
              name: "First mention a user",
              value: "",
            },
          ]);
        }

        const warningValues = await prisma.userWarn.findMany({
          where: {
            user_id: user.value,
            guild_id: interaction.guild.id,
          },
          orderBy: [
            {
              date: "desc",
            },
          ],
        });

        search(
          focusedValue.value,
          warningValues.map((w) => w.warn_id)
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
          })
        );

        break;
      }
    }
  },
});
