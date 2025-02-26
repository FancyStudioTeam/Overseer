import { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";
import { AutoLoad, Declare } from "@util/decorators.js";

@Declare({
  description: "_",
  name: "info",
})
@AutoLoad()
export default class InformationParentCommand extends ChatInputCommand {}
