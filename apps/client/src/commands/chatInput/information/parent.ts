import { AutoLoad } from "@util/decorators.js";
import { ChatInputCommand } from "@util/handlers.js";

@AutoLoad()
export default class InformationParentCommand extends ChatInputCommand {
  constructor() {
    super({
      description: "_",
      name: "info",
    });
  }
}
