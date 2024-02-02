import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
} from "oceanic.js";
import { ChatInputCommand } from "../../../classes/Builders";

export default new ChatInputCommand({
  name: "info",
  description: "-",
  options: [
    {
      name: "bot",
      description: "Displays bot information",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: "ping",
      description: "Displays bot latency",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: "server",
      description: "Displays server information",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
    {
      name: "user",
      description: "Displays a user's information",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "user",
          description: "User mention or ID",
          type: ApplicationCommandOptionTypes.USER,
          required: false,
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "information",
});
