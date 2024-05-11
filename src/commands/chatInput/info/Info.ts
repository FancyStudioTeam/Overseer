import {
  type AnyInteractionChannel,
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  type CommandInteraction,
  type Uncached,
} from "oceanic.js";
import { ChatInputCommand } from "../../../classes/Builders";
import type { Discord } from "../../../classes/Client";

export default new ChatInputCommand({
  name: "info",
  description: ".",
  options: [
    {
      name: "bot",
      description: "Displays bot information",
      descriptionLocalizations: {
        "es-419": "Muestra la información del bot",
        "es-ES": "Muestra la información del bot",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: "ping",
      description: "Displays bot latency",
      descriptionLocalizations: {
        "es-419": "Muestra la latencia del bot",
        "es-ES": "Muestra la latencia del bot",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: "server",
      description: "Displays server information",
      descriptionLocalizations: {
        "es-419": "Muestra la información del servidor",
        "es-ES": "Muestra la información del servidor",
      },
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: "user",
      description: "Displays a user's information",
      descriptionLocalizations: {
        "es-419": "Muestra la información del usuario",
        "es-ES": "Muestra la información del usuario",
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
  directory: "information",
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >
  ) => null,
});
