import path from "node:path";
import glob from "glob";
import { Embed } from "oceanic-builders";
import type { Message } from "oceanic.js";
import { Colors } from "#constants";

const commands = new Map<string, (message: Message, args: string[]) => void>();

const loadCommands = () => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  glob.sync(path.resolve(__dirname, "../commands/prefix/*.ts")).forEach((file) => {
    const command = require(file).default;
    const commandName = path.basename(file, ".ts");
    commands.set(commandName.toLowerCase(), command);
  });
};

loadCommands();

export const handlePrefixCommand = async (message: Message) => {
  const prefix = ">";
  if (!message.content.startsWith(prefix)) return;

  const [commandName, ...args] = message.content.slice(prefix.length).trim().split(" ");
  const commandHandler = commands.get(commandName.toLowerCase());

  if (commandHandler) {
    await commandHandler(message, args);
  } else {
    await message.client.rest.channels.createMessage(message.channelID, {
      embeds: new Embed().setDescription("Unknown command.").setColor(Colors.RED).toJSON(true),
    });
  }
};
