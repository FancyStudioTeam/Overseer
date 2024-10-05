import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  ApplicationIntegrationTypes,
  InteractionContextTypes,
} from "oceanic.js";
import { createChatInputCommand } from "#util/Handlers.js";

export default createChatInputCommand({
  contexts: [InteractionContextTypes.GUILD],
  description: "_",
  integrationTypes: [ApplicationIntegrationTypes.GUILD_INSTALL],
  name: "config",
  options: [
    {
      description: "_",
      name: "automations",
      options: [
        {
          description: "Creates a new automation",
          descriptionLocalizations: {
            "es-419": "Crea una nueva automatización",
            "es-ES": "Crea una nueva automatización",
          },
          name: "create",
          options: [
            {
              description: "_",
              name: "code",
              required: true,
              type: ApplicationCommandOptionTypes.ATTACHMENT,
            },
            {
              description: "Select a trigger",
              descriptionLocalizations: {
                "es-419": "Selecciona un disparador",
                "es-ES": "Selecciona un disparador",
              },
              name: "trigger",
              required: true,
              type: ApplicationCommandOptionTypes.STRING,
              choices: [
                {
                  name: "📨 When creating a message",
                  nameLocalizations: {
                    "es-419": "📨 Cuando se cree un mensaje",
                    "es-ES": "📨 Cuando se cree un mensaje",
                  },
                  value: "ON_MESSAGE_CREATE",
                },
              ],
            },
          ],
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
        {
          description: "Displays all automations",
          descriptionLocalizations: {
            "es-419": "Muestra todas las automatizaciones",
            "es-ES": "Muestra todas las automatizaciones",
          },
          name: "list",
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
      ],
      type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    },
    {
      description: "Sets the bot language",
      descriptionLocalizations: {
        "es-419": "Establece el idioma del bot",
        "es-ES": "Establece el idioma del bot",
      },
      name: "language",
      options: [
        {
          choices: [
            {
              name: "🌐 Set language to English",
              nameLocalizations: {
                "es-419": "🌐 Establecer idioma a Inglés",
                "es-ES": "🌐 Establecer idioma a Inglés",
              },
              value: "EN",
            },
            {
              name: "🌐 Set language to Spanish",
              nameLocalizations: {
                "es-419": "🌐 Establecer idioma a Español",
                "es-ES": "🌐 Establecer idioma a Español",
              },
              value: "ES",
            },
          ],
          description: "Select a language",
          descriptionLocalizations: {
            "es-419": "Selecciona un idioma",
            "es-ES": "Selecciona un idioma",
          },
          name: "language",
          required: true,
          type: ApplicationCommandOptionTypes.STRING,
        },
      ],
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
});
