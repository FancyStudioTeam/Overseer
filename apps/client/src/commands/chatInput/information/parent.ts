import { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";
import { AutoLoad } from "@util/decorators.js";

@AutoLoad()
export default class InformationParentCommand extends ChatInputCommand {
  constructor() {
    super({
      description: "_",
      name: "info",
    });
  }
}
