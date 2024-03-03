import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
} from "oceanic.js";
import { ChatInputCommand } from "../../../classes/Builders";

export default new ChatInputCommand({
  name: "util",
  description: "-",
  options: [
    {
      name: "avatar",
      description: "Displays user's avatar",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "user",
          description: "User mention or ID",
          type: ApplicationCommandOptionTypes.USER,
        },
      ],
    },
    {
      name: "weather",
      description: "Displays the weather for a location",
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: "location",
          description: "Location name",
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          maxLength: 50,
        },
      ],
    },
  ],
  type: ApplicationCommandTypes.CHAT_INPUT,
  dmPermission: false,
  directory: "utility",
});
