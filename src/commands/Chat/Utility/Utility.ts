import { ApplicationCommandOptionTypes, ApplicationCommandTypes, type CommandInteraction } from "oceanic.js";
import { BaseBuilder } from "#builders";
import type { Discord } from "#client";
import { type ChatInputCommandInterface, Directory } from "#types";

export default new BaseBuilder<ChatInputCommandInterface>({
  name: "util",
  description: "_",
  options: [
    {
      name: "avatar",
      description: "Displays user's avatar",
      descriptionLocalizations: {
        "es-419": "Muestra el avatar del usuario",
        "es-ES": "Muestra el avatar del usuario",
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
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: Directory.UTILITY,
  run: async (_client: Discord, _context: CommandInteraction) => null,
});
