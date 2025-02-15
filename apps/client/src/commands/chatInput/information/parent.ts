import { ApplicationCommandTypes } from "@discordeno/bot";
import { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";
import { AutoLoad, Declare } from "@util/decorators.js";

@Declare({
  description: "_",
  name: "info",
  type: ApplicationCommandTypes.ChatInput,
})
@AutoLoad()
export default class InformationParentCommand extends ChatInputCommand {}
