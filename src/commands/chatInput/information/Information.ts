import { createChatInputCommand } from "@util/Handlers";
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
  name: "info",
  options: [
    {
      description: "Displays bot debugging information",
      descriptionLocalizations: {
        "es-419": "Muestra información de depuración del bot",
        "es-ES": "Muestra información de depuración del bot",
      },
      name: "debug",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
});
