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
            description: "The reason for the kick",
            descriptionLocalizations: {
              "es-419": "La razón de la expulsión",
              "es-ES": "La razón de la expulsión",
            },
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
            autocomplete: false,
          },
        ],
      },
    ],
    type: ApplicationCommandTypes.CHAT_INPUT,
    dmPermission: false,
    directory: Directory.MODERATION,
    run: async (_client: Discord, _context: CommandInteraction) => null,
  });
  