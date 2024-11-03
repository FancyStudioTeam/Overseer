import { createChatInputCommand } from "@util/Handlers";
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from "oceanic.js";

export default createChatInputCommand({
  description: "_",
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
    {
      description: "Displays bot latency",
      descriptionLocalizations: {
        "es-419": "Muestra la latencia del bot",
        "es-ES": "Muestra la latencia del bot",
      },
      name: "ping",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
});
