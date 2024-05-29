import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type CommandInteraction,
} from "oceanic.js";
import { BaseBuilder } from "#builders";
import type { Discord } from "#client";
import { type ChatInputCommandInterface, Directory } from "#types";

export default new BaseBuilder<ChatInputCommandInterface>({
  name: "mod",
  description: "_",
  descriptionLocalizations: {
    "es-419": "_",
    "es-ES": "_",
  },
  options: [
    {
      name: "kick",
      description: "Kick a user",
      descriptionLocalizations: {
        "es-419": "Expulsa a un usuario",
        "es-ES": "Expulsa a un usuario",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "user",
          description: "User mention or ID",
          descriptionLocalizations: {
            "es-419": "Mención del usuario o ID",
            "es-ES": "Mención del usuario o ID",
          },
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: "reason",
          description: "Kick reason",
          descriptionLocalizations: {
            "es-419": "Razón de la expulsión",
            "es-ES": "Razón de la expulsión",
          },
          type: ApplicationCommandOptionTypes.STRING,
        },
      ],
    },
    {
      name: "ban",
      description: "Ban a user",
      descriptionLocalizations: {
        "es-419": "Banea a un usuario",
        "es-ES": "Banea a un usuario",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "user",
          description: "User mention or ID",
          descriptionLocalizations: {
            "es-419": "Mención del usuario o ID",
            "es-ES": "Mención del usuario o ID",
          },
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: "reason",
          description: "Ban reason",
          descriptionLocalizations: {
            "es-419": "Razón del baneo",
            "es-ES": "Razón del baneo",
          },
          type: ApplicationCommandOptionTypes.STRING,
        },
        {
          name: "delete_messages",
          description: "Choose an option",
          descriptionLocalizations: {
            "es-419": "Elige una opción",
            "es-ES": "Elige una opción",
          },
          type: ApplicationCommandOptionTypes.NUMBER,
          required: false,
          choices: [
            {
              name: "Retain messages",
              nameLocalizations: {
                "es-419": "Retener mensajes",
                "es-ES": "Retener mensajes",
              },
              value: 0,
            },
            {
              name: "Within the past hour",
              nameLocalizations: {
                "es-419": "En la última hora",
                "es-ES": "En la última hora",
              },
              value: 3600,
            },
            {
              name: "Within the past 6 hours",
              nameLocalizations: {
                "es-419": "En las últimas 6 horas",
                "es-ES": "En las últimas 6 horas",
              },
              value: 21600,
            },
            {
              name: "Within the past 12 hours",
              nameLocalizations: {
                "es-419": "En las últimas 12 horas",
                "es-ES": "En las últimas 12 horas",
              },
              value: 43200,
            },
            {
              name: "Within the past 24 hours",
              nameLocalizations: {
                "es-419": "En las últimas 24 horas",
                "es-ES": "En las últimas 24 horas",
              },
              value: 86400,
            },
            {
              name: "Within the past 3 days",
              nameLocalizations: {
                "es-419": "En los últimos 3 días",
                "es-ES": "En los últimos 3 días",
              },
              value: 259200,
            },
            {
              name: "Within the past 7 days",
              nameLocalizations: {
                "es-419": "En los últimos 7 días",
                "es-ES": "En los últimos 7 días",
              },
              value: 604800,
            },
          ],
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: Directory.MODERATION,
  run: async (_client: Discord, _context: CommandInteraction) => null,
});
