import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type AutocompleteInteraction,
} from "oceanic.js";
import { ChatInputCommand } from "../../../classes/Builders";
import { timezones } from "../../../util/timezones";

export default new ChatInputCommand({
  name: "config",
  description: "-",
  options: [
    {
      name: "language",
      description: "Sets the bot language",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "language",
          description: "Select one of the options",
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            {
              name: "Set the language to English",
              value: "en",
            },
            {
              name: "Set the language to Spanish",
              value: "es",
            },
          ],
        },
      ],
    },
    {
      name: "premium",
      description: "-",
      type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
      options: [
        {
          name: "claim",
          description: "Claims a premium membership",
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          options: [
            {
              name: "code",
              description: "Code ID",
              type: ApplicationCommandOptionTypes.STRING,
              required: true,
            },
          ],
        },
        {
          name: "revoke",
          description: "Revokes premium server membership",
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
      ],
    },
    {
      name: "suggestions",
      description: "Configures the suggestion system",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: "timezone",
      description: "Sets the bot's time zone",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "timezone",
          description: "Select one of the options",
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          autocomplete: true,
        },
        {
          name: "12-hours",
          description: "Select one of the options",
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            {
              name: "Set the time format to 12 hours",
              value: "true",
            },
            {
              name: "Set the time format to 24 hours",
              value: "false",
            },
          ],
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "configuration",
  autocomplete: async (interaction: AutocompleteInteraction) => {
    const subcommand = interaction.data.options.getSubCommand(true);

    switch (subcommand.join("_")) {
      case "timezone": {
        const availableChoices: string[] = [];
        const focusedValue = interaction.data.options.getFocused(true);
        const timezoneValues = Object.keys(timezones);

        search(focusedValue.value.toString(), timezoneValues);

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
              name: c,
              value: c,
            };
          }),
        );

        break;
      }
    }
  },
});
