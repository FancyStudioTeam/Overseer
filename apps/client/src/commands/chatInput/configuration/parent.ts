import { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";
import { AutoLoad, Declare } from "@util/decorators.js";

@Declare({
  description: "_",
  name: "config",
})
@AutoLoad()
export default class ConfigurationParentCommand extends ChatInputCommand {}
