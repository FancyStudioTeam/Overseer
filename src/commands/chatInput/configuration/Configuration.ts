import { createChatInputCommand } from "@util/Handlers";
import { formatTimestamp } from "@util/utils";
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from "oceanic.js";
import { match } from "ts-pattern";

export default createChatInputCommand({
  description: "_",
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
              maxLength: 35,
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
          description: "Deletes an automation",
          descriptionLocalizations: {
            "es-419": "Elimina una automatización",
            "es-ES": "Elimina una automatización",
          },
          name: "delete",
          options: [
            {
              autocomplete: true,
              description: "The automation ID",
              descriptionLocalizations: {
                "es-419": "La ID de la automatización",
                "es-ES": "La ID de la automatización",
              },
              name: "automation_id",
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
    {
      description: "_",
      name: "membership",
      options: [
        {
          description: "Redeems a premium membership",
          descriptionLocalizations: {
            "es-419": "Canjea una membresía premium",
            "es-ES": "Canjea una membresía premium",
          },
          name: "redeem",
          options: [
            {
              description: "The membership ID",
              descriptionLocalizations: {
                "es-419": "La ID de la membresía",
                "es-ES": "La ID de la membresía",
              },
              maxLength: 36,
              minLength: 36,
              name: "membership_id",
              required: true,
              type: ApplicationCommandOptionTypes.STRING,
            },
          ],
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
      ],
      type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  autoComplete: async ({ client, context }) => {
    const subCommand = context.data.options.getSubCommand(true).join("_");

    match(subCommand).with("automations_delete", async () => {
      const guildAutomations = await client.prisma.guildAutomation.findMany({
        where: {
          general: {
            is: {
              guildId: context.guildID,
            },
          },
        },
      });

      if (guildAutomations.length === 0) return;

      const availableAutomationsResults = guildAutomations.map(({ automationId, createdAt, general: { name } }) => {
        const formattedCreatedAt = formatTimestamp(createdAt, "dddd[, ]MMMM DD[, ]YYYY[, ]HH:mm");

        return {
          name:
            {
              "es-419": `🗑️ Eliminar automatización "${name}" - Creado el ${formattedCreatedAt}`,
              "es-ES": `🗑️ Eliminar automatización "${name}" - Creado el ${formattedCreatedAt}`,
            }[context.locale] ?? `🗑️ Delete "${name}" automation - Created on ${formattedCreatedAt}`,
          value: automationId,
        };
      });

      await context.result(availableAutomationsResults);
    });
  },
});
