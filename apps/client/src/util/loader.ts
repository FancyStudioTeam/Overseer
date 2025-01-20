import { join, resolve } from "node:path";
import type { CreateApplicationCommand } from "@discordeno/bot";
import { loadDirectoryFiles } from "@functions/loadDirectoryFiles.js";
import { client } from "@index";
import type { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";
import type { UserContextCommand } from "@structures/commands/UserContextCommand.js";
import { CreateCommandTypes } from "@types";
import type { Path } from "glob";
import { match } from "ts-pattern";

const resolvedApplicationCommands: CreateApplicationCommand[] = [];
const currentFolderPath = process.cwd();
const currentFolder = join(currentFolderPath, "dist");

const resolvePath = (path: Path) => `file://${resolve(path.parentPath, path.name)}`;

export const initLoader = async () => await Promise.all([loadEvents(), loadCommands()]);

const loadEvents = async () => {
  const eventPaths = await loadDirectoryFiles(`${join(currentFolder, "events")}/**/*.{js,ts}`);
  const resolvedEventPaths = eventPaths.map((eventPath) => resolvePath(eventPath));

  resolvedEventPaths.forEach(async (eventPath, _) => await import(eventPath));
};

const loadCommands = async () => {
  const commandPaths = await loadDirectoryFiles([
    `${join(currentFolder, "commands")}/chatInput/**/parent.{js,ts}`,
    `${join(currentFolder, "commands")}/user/**/*.command.{js,ts}`,
  ]);

  commandPaths.forEach(async (commandPath, _) => {
    const resolvedCommandPath = resolvePath(commandPath);
    const { default: CommandClass } = await import(resolvedCommandPath);
    const command = new CommandClass() as AnyCommand;

    const resolvedApplicationCommand = await match(command)
      .returnType<Promise<CreateApplicationCommand>>()
      .with(
        {
          type: CreateCommandTypes.ChatInput,
        },
        async (chatInputCommand) => {
          const { _autoLoad, _data, _options } = chatInputCommand;
          const { name: parentCommandName } = _data;

          if (_autoLoad) {
            const { parentPath } = commandPath;
            const subCommandPaths = await loadDirectoryFiles(`${parentPath}/*.command.{js,ts}`);
            const subCommands = await Promise.all(
              subCommandPaths.map(async (subCommandPath) => {
                const resolvedSubCommandPath = resolvePath(subCommandPath);
                const { default: SubCommandClass } = await import(resolvedSubCommandPath);
                const subCommand = new SubCommandClass() as ChatInputSubCommand;
                const resolvedSubCommand = subCommand.toJSON();
                const { name } = resolvedSubCommand;

                client.applicationCommands.chatInput.set([parentCommandName, name].join("_"), subCommand);

                return resolvedSubCommand;
              }),
            );

            _options.push(...subCommands);
          }

          const resolvedChatInputCommand = chatInputCommand.toJSON();

          return resolvedChatInputCommand;
        },
      )
      .with(
        {
          type: CreateCommandTypes.User,
        },
        async (userContextCommand) => {
          const resolvedUserContextCommand = userContextCommand.toJSON();
          const { name } = resolvedUserContextCommand;

          client.applicationCommands.user.set(name, userContextCommand);

          return await Promise.resolve(resolvedUserContextCommand);
        },
      )
      .run();

    resolvedApplicationCommands.push(resolvedApplicationCommand);
  });

  setTimeout(async () => {
    await client.helpers.upsertGlobalApplicationCommands(resolvedApplicationCommands);
  }, 2500);
};

type AnyCommand = ChatInputCommand | UserContextCommand;
