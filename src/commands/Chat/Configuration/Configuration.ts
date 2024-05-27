import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type AutocompleteInteraction,
  type CommandInteraction,
  type InteractionOptionsString,
} from "oceanic.js";
import { match } from "ts-pattern";
import { BaseBuilder } from "#builders";
import type { Discord } from "#client";
import timezones from "#timezones";
import { type ChatInputCommandInterface, Directory } from "#types";
import { search } from "#util";

export default new BaseBuilder<ChatInputCommandInterface>({
  name: "config",
  description: "_",
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
      description: "_",
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
          description: "Display time in pm / am format",
          descriptionLocalizations: {
            "es-419": "Mostrar hora en formato pm / am",
            "es-ES": "Mostrar hora en formato pm / am",
          },
          type: ApplicationCommandOptionTypes.BOOLEAN,
          required: true,
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: Directory.CONFIGURATION,
  autocomplete: async (_client: Discord, _context: AutocompleteInteraction) => {
    const _subCommandOption = _context.data.options.getSubCommand(true);

    match(_subCommandOption.join("_"))
      .with("timezone", async () => {
        const _focusedOption =
          _context.data.options.getFocused<InteractionOptionsString>(true);
        const choices = search<string>(_focusedOption.value, timezones);

        if (!choices.length) {
          return await _context.result([
            {
              name:
                {
                  "es-419": "❌ Sin opciones disponibles",
                  "es-ES": "❌ Sin opciones disponibles",
                }[_context.locale] ?? "❌ No options available",
              value: "",
            },
          ]);
        }

        await _context.result(
          choices.slice(0, 25).map((choice) => {
            return {
              name:
                {
                  "es-419": `🌍 Establecer la zona horaria a "${choice}"`,
                  "es-ES": `🌍 Establecer la zona horaria a "${choice}"`,
                }[_context.locale] ?? `🌍 Set time zone to "${choice}"`,
              value: choice,
            };
          }),
        );
      })
      .otherwise(() => null);
  },
  run: async (_client: Discord, _context: CommandInteraction) => null,
});
