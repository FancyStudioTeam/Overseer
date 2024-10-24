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
  name: "info",
  options: [
    {
      description: "Displays bot debugging information",
      name: "debug",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
});
