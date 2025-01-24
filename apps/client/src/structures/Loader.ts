import { join, resolve } from "node:path";
import type { ApplicationCommandOption, CreateApplicationCommand } from "@discordeno/bot";
import { CreateCommandTypes, type MaybeAwaitable } from "@types";
import { client } from "@util/client.js";
import { type Path, glob } from "glob";
import { match } from "ts-pattern";
import type { ChatInputCommand } from "./commands/ChatInputCommand.js";
import type { ChatInputSubCommand } from "./commands/ChatInputSubCommand.js";
import type { UserContextCommand } from "./commands/UserContextCommand.js";

const __dirname = import.meta.dirname;
const distFolderPath = join(__dirname, "..");

export class Importer {
  /** Import all the required files to work. */
  async import() {
    await Promise.all([this.importCommands(), this.importEvents(), this.importProxyServer()]);
  }

  /** Import the command files. */
  private async importCommands() {
    const chatInputCommandsPattern = `${join(distFolderPath, "commands")}/chatInput/**/parent.{js,ts}`;
    const userCommandsPattern = `${join(distFolderPath, "commands")}/user/**/*.command.{js,ts}`;
    const loadedCommandPaths = await this.loadDirectoryFiles([chatInputCommandsPattern, userCommandsPattern]);
    /** Import all the loaded command paths. */
    const resolvedCommandPaths = await this._importCommands(loadedCommandPaths);

    /** Deploy the commands to Discord. */
    await client.helpers.upsertGlobalApplicationCommands(resolvedCommandPaths);
  }

  /**
   * Import the command files.
   * @internal
   * @param commandPaths The command paths to import.
   * @returns The resolved application commands.
   */
  private async _importCommands(commandPaths: Path[]): Promise<CreateApplicationCommand[]> {
    /** Create an import promise for each command path. */
    const importPromises = commandPaths.map(async (commandPath, _) => {
      const resolvedCommandPath = this.resolvePath(commandPath);
      /** Commands are exported as default instances. */
      const { default: CommandClass } = await import(resolvedCommandPath);
      const command = new CommandClass() as AnyCommand;

      /** Return the resoved application command from the match statement. */
      return await match(command)
        /**
         * Set the return type to the resolved application command.
         * Use "MaybeAwaitable" as some commands do not have any promise to resolve.
         */
        .returnType<MaybeAwaitable<CreateApplicationCommand>>()
        .with(
          {
            type: CreateCommandTypes.ChatInput,
          },
          async (chatInputCommand) => {
            const { _autoLoad, _options } = chatInputCommand;
            const resolvedChatInputCommand = chatInputCommand.toJSON();
            const { name } = resolvedChatInputCommand;

            /** Auto load the chat input sub commands options whether "_autoLoad" is "true". */
            if (_autoLoad) {
              const { parentPath } = commandPath;
              /** Get the resolved chat input sub commands. */
              const subCommands = await this._importSubCommands(name, parentPath);

              /** Push the resolved chat input sub commands to the options. */
              _options.push(...subCommands);
            }

            return resolvedChatInputCommand;
          },
        )
        .with(
          {
            type: CreateCommandTypes.User,
          },
          (userContextCommand) => {
            const resolvedUserContextCommand = userContextCommand.toJSON();
            const { name } = resolvedUserContextCommand;

            /** Set the user context command to its collection. */
            client.applicationCommands.user.set(name, userContextCommand);

            return resolvedUserContextCommand;
          },
        )
        /** Run the match statement and return the value. */
        .run();
    });

    /** Execute all the import promises. */
    return await Promise.all(importPromises);
  }

  /**
   * Import the sub commands.
   * @internal
   * @param parentCommandName The parent command name.
   * @param parentPath The parent command path.
   * @returns The resolved chat input sub commands.
   */
  private async _importSubCommands(parentCommandName: string, parentPath: string): Promise<ApplicationCommandOption[]> {
    const subCommandsPattern = `${parentPath}/*.command.{js,ts}`;
    const loadedSubCommandPaths = await this.loadDirectoryFiles(subCommandsPattern);
    /** Create an import promise for each sub command path. */
    const importPromises = loadedSubCommandPaths.map(async (subCommandPath, _) => {
      const resolvedSubCommandPath = this.resolvePath(subCommandPath);
      /** Commands are exported as default instances. */
      const { default: SubCommandClass } = await import(resolvedSubCommandPath);
      const subCommand = new SubCommandClass() as ChatInputSubCommand;
      const resolvedSubCommand = subCommand.toJSON();
      const { name } = resolvedSubCommand;

      /** Set the chat input sub command to its collection. */
      client.applicationCommands.chatInput.set([parentCommandName, name].join("_"), subCommand);

      return resolvedSubCommand;
    });

    /** Execute all the import promises. */
    return await Promise.all(importPromises);
  }

  /** Import the event files. */
  private async importEvents(): Promise<void> {
    const eventsPattern = `${join(distFolderPath, "events")}/**/*.{js,ts}`;
    const loadedEventPaths = await this.loadDirectoryFiles(eventsPattern);
    /** Resolve all the event paths. */
    const resolvedEventPaths = loadedEventPaths.map((eventPath) => this.resolvePath(eventPath));

    resolvedEventPaths.forEach(async (eventPath, _) => await import(eventPath));
  }

  /** Import the proxy server. */
  async importProxyServer(): Promise<void> {
    await import("@api");
  }

  /**
   * Create a resolved path from a given path.
   * @param path The path to resolve.
   * @returns The resolved path.
   */
  private resolvePath(path: Path): string {
    return `file://${resolve(path.parentPath, path.name)}`;
  }

  /**
   * Load all the files from a given pattern.
   * @param pattern The pattern to load the files from.
   * @returns The loaded path files.
   */
  private async loadDirectoryFiles(pattern: string | string[]): Promise<Path[]> {
    const loadedPaths = await glob(pattern, {
      ignore: ["node_modules"],
      /** Include the files with their file type. */
      withFileTypes: true,
    });
    const filteredFiles = loadedPaths.filter(
      (file) => file.isFile() && (file.name.endsWith(".js") || file.name.endsWith(".ts")),
    );

    return filteredFiles;
  }
}

type AnyCommand = ChatInputCommand | UserContextCommand;
