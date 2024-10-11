import { createChatInputCommand } from "@util/Handlers.js";
import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  ApplicationIntegrationTypes,
  InteractionContextTypes,
} from "oceanic.js";

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
              description: "The automation name",
              descriptionLocalizations: {
                "es-419": "El nombre de la automatización",
                "es-ES": "El nombre de la automatización",
              },
              name: "name",
              required: true,
              type: ApplicationCommandOptionTypes.STRING,
            },
            {
              description: "The automation script",
              descriptionLocalizations: {
                "es-419": "El script de la automatización",
                "es-ES": "El script de la automatización",
              },
              name: "script",
              required: true,
              type: ApplicationCommandOptionTypes.ATTACHMENT,
            },
            {
              choices: [
                {
                  name: "📨 Execute the automation when a new message is created",
                  nameLocalizations: {
                    "es-419": "📨 Ejecutar la automatización cuando se crea un nuevo mensaje",
                    "es-ES": "📨 Ejecutar la automatización cuando se crea un nuevo mensaje",
                  },
                  value: "ON_MESSAGE_CREATE",
                },
              ],
              description: "The automation event",
              descriptionLocalizations: {
                "es-419": "El evento de la automatización",
                "es-ES": "El evento de la automatización",
              },
              name: "trigger",
              required: true,
              type: ApplicationCommandOptionTypes.STRING,
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
              name: "🌍 Set language to English",
              nameLocalizations: {
                "es-419": "🌍 Establecer idioma a Inglés",
                "es-ES": "🌍 Establecer idioma a Inglés",
              },
              value: "EN",
            },
            {
              name: "🌍 Set language to Spanish",
              nameLocalizations: {
                "es-419": "🌍 Establecer idioma a Español",
                "es-ES": "🌍 Establecer idioma a Español",
              },
              value: "ES",
            },
          ],
          description: "The bot language",
          descriptionLocalizations: {
            "es-419": "El idioma del bot",
            "es-ES": "El idioma del bot",
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
