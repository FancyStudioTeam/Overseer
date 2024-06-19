import { Duration } from "@sapphire/time-utilities";
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from "oceanic.js";
import { BaseBuilder } from "#base";
import { type ChatInputCommand, Directories } from "#types";

export default new BaseBuilder<ChatInputCommand>({
  name: "mod",
  description: "_",
  options: [
    {
      name: "ban",
      description: "Bans a user",
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
          type: ApplicationCommandOptionTypes.INTEGER,
          choices: [
            {
              name: "❌ Do not delete messages",
              nameLocalizations: {
                "es-419": "❌ No eliminar mensajes",
                "es-ES": "❌ No eliminar mensajes",
              },
              value: new Duration("0 seconds").offset,
            },
            {
              name: "⏰ Within the past hour",
              nameLocalizations: {
                "es-419": "⏰ En la última hora",
                "es-ES": "⏰ En la última hora",
              },
              value: new Duration("1 hour").offset,
            },
            {
              name: "⏰ Within the past 6 hours",
              nameLocalizations: {
                "es-419": "⏰ En las últimas 6 horas",
                "es-ES": "⏰ En las últimas 6 horas",
              },
              value: new Duration("6 hours").offset,
            },
            {
              name: "⏰ Within the past 12 hours",
              nameLocalizations: {
                "es-419": "⏰ En las últimas 12 horas",
                "es-ES": "⏰ En las últimas 12 horas",
              },
              value: new Duration("12 hours").offset,
            },
            {
              name: "⏰ Within the past 24 hours",
              nameLocalizations: {
                "es-419": "⏰ En las últimas 24 horas",
                "es-ES": "⏰ En las últimas 24 horas",
              },
              value: new Duration("24 hours").offset,
            },
            {
              name: "⏰ Within the past 3 days",
              nameLocalizations: {
                "es-419": "⏰ En los últimos 3 días",
                "es-ES": "⏰ En los últimos 3 días",
              },
              value: new Duration("3 days").offset,
            },
            {
              name: "⏰ Within the past 7 days",
              nameLocalizations: {
                "es-419": "⏰ En los últimos 7 días",
                "es-ES": "⏰ En los últimos 7 días",
              },
              value: new Duration("7 days").offset,
            },
          ],
        },
      ],
    },
    {
      name: "kick",
      description: "Kicks a user",
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
      name: "purge",
      description: "Deletes a number of messages",
      descriptionLocalizations: {
        "es-419": "Elimina una cantidad de mensajes",
        "es-ES": "Elimina una cantidad de mensajes",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "amount",
          description: "Amount of messages",
          descriptionLocalizations: {
            "es-419": "Cantidad de mensajes",
            "es-ES": "Cantidad de mensajes",
          },
          type: ApplicationCommandOptionTypes.INTEGER,
          required: true,
          maxValue: 500,
          minValue: 1,
        },
      ],
    },
    {
      name: "softban",
      description: "Bans and unbans a user to delete their messages",
      descriptionLocalizations: {
        "es-419": "Banea y desbanea a un usuario para eliminar sus mensajes",
        "es-ES": "Banea y desbanea a un usuario para eliminar sus mensajes",
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
          description: "Reason for the soft ban",
          descriptionLocalizations: {
            "es-419": "Razón para el soft ban",
            "es-ES": "Razón para el soft ban",
          },
          type: ApplicationCommandOptionTypes.STRING,
        },
      ],
    },
    {
      name: "timeout",
      description: "_",
      type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
      options: [
        {
          name: "add",
          description: "Adds a timeout to a user",
          descriptionLocalizations: {
            "es-419": "Añade un tiempo de espera a un usuario",
            "es-ES": "Añade un tiempo de espera a un usuario",
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
              name: "duration",
              description: "Duration in days / hours / minutes / seconds",
              descriptionLocalizations: {
                "es-419": "Duración en días / horas / minutos / segundos",
                "es-ES": "Duración en días / horas / minutos / segundos",
              },
              type: ApplicationCommandOptionTypes.STRING,
              required: true,
            },
            {
              name: "reason",
              description: "Timeout reason",
              descriptionLocalizations: {
                "es-419": "Razón del tiempo de espera",
                "es-ES": "Razón del tiempo de espera",
              },
              type: ApplicationCommandOptionTypes.STRING,
            },
          ],
        },
        {
          name: "remove",
          description: "Removes a timeout from a user",
          descriptionLocalizations: {
            "es-419": "Elimina un tiempo de espera de un usuario",
            "es-ES": "Elimina un tiempo de espera de un usuario",
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
              description: "Un-timeout reason",
              descriptionLocalizations: {
                "es-419": "Razón para eliminar el tiempo de espera",
                "es-ES": "Razón para eliminar el tiempo de espera",
              },
              type: ApplicationCommandOptionTypes.STRING,
            },
          ],
        },
      ],
    },
    {
      name: "unban",
      description: "Unbans a user",
      descriptionLocalizations: {
        "es-419": "Desbanea a un usuario",
        "es-ES": "Desbanea a un usuario",
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
          description: "Unban reason",
          descriptionLocalizations: {
            "es-419": "Razón del desbaneo",
            "es-ES": "Razón del desbaneo",
          },
          type: ApplicationCommandOptionTypes.STRING,
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: Directories.MODERATION,
});
