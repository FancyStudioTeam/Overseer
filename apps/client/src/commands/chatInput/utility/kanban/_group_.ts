import { ChatInputSubCommandGroup } from "@structures/commands/ChatInputSubCommandGroup.js";
import { AutoLoad, Declare } from "@util/decorators.js";

@Declare({
  description: "_",
  name: "kanban",
})
@AutoLoad()
export default class KanbanSubCommandGroup extends ChatInputSubCommandGroup {}
