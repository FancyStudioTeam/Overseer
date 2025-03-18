import { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";
import { AutoLoad, Declare } from "@util/decorators.js";

@Declare({
  description: "_",
  name: "util",
})
@AutoLoad()
export default class UtilityParentCommand extends ChatInputCommand {}
