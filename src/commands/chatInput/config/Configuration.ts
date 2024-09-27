import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  ApplicationIntegrationTypes,
  InteractionContextTypes,
} from "oceanic.js";
import { createChatInputCommand } from "#util/Handlers.js";

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
          description: "_",
          name: "create",
          options: [
            {
              description: "_",
              name: "code",
              required: true,
              type: ApplicationCommandOptionTypes.ATTACHMENT,
            },
          ],
          type: ApplicationCommandOptionTypes.SUB_COMMAND,
        },
      ],
      type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
});
