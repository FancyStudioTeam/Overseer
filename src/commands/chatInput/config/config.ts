import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type AutocompleteInteraction,
  type CommandInteraction,
  type InteractionOptionsString,
} from "oceanic.js";
import { ChatInputCommand } from "../../../classes/Builders";
import type { Discord } from "../../../classes/Client";
import timezones from "../../../util/timezones";

export default new ChatInputCommand({
  name: "config",
  description: ".",
  options: [
    {
      name: "language",
      description: "Sets the bot language",
      descriptionLocalizations: {
        "es-419": "Establece el idioma del bot",
        "es-ES": "Establece el idioma del bot",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "language",
          description: "Bot language",
          descriptionLocalizations: {
            "es-419": "Idioma del bot",
            "es-ES": "Idioma del bot",
          },
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            {
              name: '🌍 Set language to "English"',
              nameLocalizations: {
                "es-419": '🌍 Establecer el idioma a "Inglés"',
                "es-ES": '🌍 Establecer el idioma a "Inglés"',
              },
              value: "EN",
            },
            {
              name: '🌍 Set language to "Spanish"',
              nameLocalizations: {
                "es-419": '🌍 Establecer el idioma a "Español"',
                "es-ES": '🌍 Establecer el idioma a "Español"',
              },
              value: "ES",
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
          descriptionLocalizations: {
            "es-419": "Reclama una membresía premium",
            "es-ES": "Reclama una membresía premium",
          },
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
          options: [
            {
              name: "code",
              description: "Code ID",
              descriptionLocalizations: {
                "es-419": "ID del código",
                "es-ES": "ID del código",
              },
              type: ApplicationCommandOptionTypes.STRING,
              required: true,
              maxLength: 36,
              minLength: 36,
            },
          ],
        },
        {
          name: "revoke",
          description: "Revokes premium membership",
          descriptionLocalizations: {
            "es-419": "Revoca la membresía premium",
            "es-ES": "Revoca la membresía premium",
          },
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
      ],
    },
    {
      name: "suggestions",
      description: "Configures the suggestion system",
      descriptionLocalizations: {
        "es-419": "Configura el sistema de sugerencias",
        "es-ES": "Configura el sistema de sugerencias",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: "timezone",
      description: "Sets the bot's time zone",
      descriptionLocalizations: {
        "es-419": "Establece la zona horaria del bot",
        "es-ES": "Establece la zona horaria del bot",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "timezone",
          description: "Bot time zone",
          descriptionLocalizations: {
            "es-419": "Zona horaria del bot",
            "es-ES": "Zona horaria del bot",
          },
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          autocomplete: true,
        },
        {
          name: "12-hours",
          description: "Display time in p.m. / a.m. format",
          descriptionLocalizations: {
            "es-419": "Mostrar hora en formato p.m. / a.m.",
            "es-ES": "Mostrar hora en formato p.m. / a.m.",
          },
          type: ApplicationCommandOptionTypes.BOOLEAN,
          required: true,
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "configuration",
  autocomplete: async (
    _client: Discord,
    _interaction: AutocompleteInteraction
  ) => {
    const subcommand = _interaction.data.options.getSubCommand(true);

    switch (subcommand.join("_")) {
      case "timezone": {
        const availableChoices: string[] = [];
        const focusedValue =
          _interaction.data.options.getFocused<InteractionOptionsString>(true);

        search(focusedValue.value, timezones);

        function search(query: string, allChoices: string[]) {
          const newQuery = query.toLowerCase();

          // biome-ignore lint/style/useForOf:
          for (let i = 0; i < allChoices.length; i++) {
            if (allChoices[i].toLowerCase().includes(newQuery)) {
              availableChoices.push(allChoices[i]);
            }
          }

          return availableChoices;
        }

        if (!availableChoices.length) {
          const locales: Record<string, string> = {
            "es-419": "❌ Sin opciones disponibles",
            "es-ES": "❌ Sin opciones disponibles",
          };

          return await _interaction.result([
            {
              name: Object.hasOwn(locales, _interaction.locale)
                ? locales[<string>_interaction.locale]
                : "❌ No options available",
              value: "",
            },
          ]);
        }

        await _interaction
          .result(
            availableChoices.slice(0, 25).map((c) => {
              const locales: Record<string, string> = {
                "es-419": `🌍 Establecer la zona horaria a "${c}"`,
                "es-ES": `🌍 Establecer la zona horaria a "${c}"`,
              };

              return {
                name: Object.hasOwn(locales, _interaction.locale)
                  ? locales[<string>_interaction.locale]
                  : `🌍 Set time zone to "${c}"`,
                value: c,
              };
            })
          )
          .catch(() => null);

        break;
      }
    }
  },
  run: async (_client: Discord, _interaction: CommandInteraction) => null,
});
