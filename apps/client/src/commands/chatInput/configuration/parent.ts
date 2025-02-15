import { ApplicationCommandTypes } from "@discordeno/bot";
import { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";
import { AutoLoad, Declare } from "@util/decorators.js";

@Declare({
  description: "_",
  name: "config",
  type: ApplicationCommandTypes.ChatInput,
})
@AutoLoad()
export default class ConfigurationParentCommand extends ChatInputCommand {}
