import { join, resolve } from "node:path";
import type { ApplicationCommandOption, CreateApplicationCommand } from "@discordeno/bot";
import { client } from "@util/client.js";
import { type Path, glob } from "glob";
import { ChatInputCommand } from "./commands/ChatInputCommand.js";
import { ChatInputSubCommand } from "./commands/ChatInputSubCommand.js";
import { ChatInputSubCommandGroup } from "./commands/ChatInputSubCommandGroup.js";
import { UserContextCommand } from "./commands/UserContextCommand.js";

const __dirname = import.meta.dirname;
const distFolderPath = join(__dirname, "..");

export class Loader {
  /** Initializes the resource imports. */
  async _init(): Promise<void> {
    await Promise.all([this.importEvents(), this.importCommands(), this.importProxyApplication()]);
  }

  /**
   * Handles a command instance.
   * @param commandInstance - The command instance to handle.
   * @param parentCommandPath - The parent command path. Only used for chat input commands.
   * @returns The resolved application command object from the command instance.
   */
  private async handleCommandInstance(
    commandInstance: AnyCommand,
    parentCommandFolderPath: string,
  ): Promise<CreateApplicationCommand> {
    if (commandInstance instanceof ChatInputCommand) {
      const { _autoLoad, _subCommandOptions } = commandInstance;
      const resolvedApplicationCommand = commandInstance.toJSON();
      const { name: parentCommandName } = resolvedApplicationCommand;

      if (_autoLoad) {
        const subCommandsPathPattern = this.getSubCommandsPattern(parentCommandFolderPath);
        const loadedSubCommandPaths = await this.loadDirectoryFiles(subCommandsPathPattern, {
          includeFolders: true,
        });
        const importPromises = loadedSubCommandPaths.map(async (path) => {
          const resolvedImportPath = this.resolvePath(path);
          /**
           * All commands are exported as default exports.
           * So retreive the "default" property from the object and use it as the command instance.
           */
          const { default: CommandInstance } = await import(resolvedImportPath);
          const command = new CommandInstance() as AnySubCommand;
          const { parentPath } = path;
          const resolvedApplicationCommandOption = this.handleSubCommandInstance(
            command,
            parentPath,
            parentCommandName,
          );

          return resolvedApplicationCommandOption;
        });
        /**
         * Handle all the promises in parallel.
         * This returns a list of the resolved application command option objects.
         */
        const resolvedApplicationCommandOptions = await Promise.all(importPromises);

        _subCommandOptions.push(...resolvedApplicationCommandOptions);
      }

      return resolvedApplicationCommand;
    }

    if (commandInstance instanceof UserContextCommand) {
      const resolvedApplicationCommand = commandInstance.toJSON();
      const { name } = resolvedApplicationCommand;
      const { applicationCommands } = client;
      const { userContext } = applicationCommands;

      userContext.set(name, commandInstance);

      return resolvedApplicationCommand;
    }

    throw new Error(`Cannot handle "${commandInstance}" command instance.`);
  }

  /**
   * Handles a sub command instance.
   * @param commandInstance - The sub command instance to handle.
   * @param parentCommandFolderPath - The parent command folder path.
   * @param parentCommandName - The command parent name.
   * @param subCommandGroupName - The sub command group name. If provided.
   * @returns The resolved application command option object from the sub command instance.
   */
  private async handleSubCommandInstance(
    commandInstance: AnySubCommand,
    parentCommandFolderPath: string,
    parentCommandName: string,
    subCommandGroupName?: string,
  ): Promise<ApplicationCommandOption> {
    if (commandInstance instanceof ChatInputSubCommandGroup) {
      const { _autoLoad, _subCommandOptions } = commandInstance;
      const resolvedApplicationCommandOption = commandInstance.toJSON();
      const { name: subCommandGroupName } = resolvedApplicationCommandOption;

      if (_autoLoad) {
        const subCommandsPathPattern = this.getSubCommandsPattern(parentCommandFolderPath);
        const loadedSubCommandPaths = await this.loadDirectoryFiles(subCommandsPathPattern, {
          includeFolders: true,
        });
        const importPromises = loadedSubCommandPaths.map(async (path) => {
          const resolvedImportPath = this.resolvePath(path);
          /**
           * All commands are exported as default exports.
           * So retreive the "default" property from the object and use it as the command instance.
           */
          const { default: CommandInstance } = await import(resolvedImportPath);
          const command = new CommandInstance() as AnySubCommand;
          const { parentPath } = path;
          const resolvedApplicationCommandOption = await this.handleSubCommandInstance(
            command,
            parentPath,
            parentCommandName,
            subCommandGroupName,
          );

          return resolvedApplicationCommandOption;
        });
        /**
         * Handle all the promises in parallel.
         * This returns a list of the resolved application command option objects.
         */
        const resolvedApplicationCommandOptions = await Promise.all(importPromises);

        _subCommandOptions.push(...resolvedApplicationCommandOptions);
      }

      return resolvedApplicationCommandOption;
    }

    if (commandInstance instanceof ChatInputSubCommand) {
      const resolvedApplicationCommandOption = commandInstance.toJSON();
      const { name: subCommandName } = resolvedApplicationCommandOption;
      const { applicationCommands } = client;
      const { chatInput } = applicationCommands;
      const collectionKey = subCommandGroupName
        ? `${parentCommandName}_${subCommandGroupName}_${subCommandName}`
        : `${parentCommandName}_${subCommandName}`;

      chatInput.set(collectionKey, commandInstance);

      return resolvedApplicationCommandOption;
    }

    throw new Error(`Cannot handle "${commandInstance}" sub command instance.`);
  }

  /** Imports all the commands from the commands folder. */
  private async importCommands(): Promise<void> {
    const commandsPathPattern = this.getCommandsPattern();
    const loadedCommandPaths = await this.loadDirectoryFiles(commandsPathPattern);
    const importPromises = loadedCommandPaths.map(async (path) => {
      const resolvedImportPath = this.resolvePath(path);
      /**
       * All commands are exported as default exports.
       * So retreive the "default" property from the object and use it as the command instance.
       */
      const { default: CommandInstance } = await import(resolvedImportPath);
      const command = new CommandInstance() as AnyCommand;
      /** This will give us the path of the parent folder from the command. */
      const { parentPath } = path;
      const resolvedApplicationCommand = await this.handleCommandInstance(command, parentPath);

      return resolvedApplicationCommand;
    });
    /**
     * Handle all the promises in parallel.
     * This returns a list of the resolved application command objects.
     */
    const resolvedApplicationCommands = await Promise.all(importPromises);

    await this.upsertApplicationCommands(resolvedApplicationCommands);
  }

  /** Imports all the events from the events folder. */
  private async importEvents(): Promise<void> {
    const eventsPathPattern = this.getEventsPattern();
    const loadedEventPaths = await this.loadDirectoryFiles(eventsPathPattern);
    const importPromises = loadedEventPaths.map(async (path) => {
      const resolvedImportPath = this.resolvePath(path);

      await import(resolvedImportPath);
    });

    /** Handle all the promises in parallel. */
    await Promise.all(importPromises);
  }

  /** Imports the Nest.js proxy application. */
  private async importProxyApplication(): Promise<void> {
    await import("@proxy/index.js");
  }

  /**
   * Gets the commands Glob patterns.
   * @returns The commands Glob patterns.
   */
  private getCommandsPattern(): string[] {
    const chatInputPattern = `${distFolderPath}/commands/chatInput/**/parent.{js,ts}`;
    const userContextPattern = `${distFolderPath}/commands/userContext/**/*.command.{js,ts}`;

    return [chatInputPattern, userContextPattern];
  }

  /**
   * Gets the events Glob pattern.
   * @returns The events Glob pattern.
   */
  private getEventsPattern(): string {
    return `${distFolderPath}/events/**/*.event.{js,ts}`;
  }

  /**
   * Gets the sub commands Glob patterns.
   * @param parentCommandFolderPath - The parent command folder path.
   * @returns The sub commands Glob patterns.
   */
  private getSubCommandsPattern(parentCommandFolderPath: string): string[] {
    const subCommandsPattern = `${parentCommandFolderPath}/*.command.{js,ts}`;
    const subCommandGroupsPattern = `${parentCommandFolderPath}/*/group.{js,ts}`;

    return [subCommandsPattern, subCommandGroupsPattern];
  }

  /**
   * Loads all the files from a given Glob pattern.
   * @param pattern - The pattern to load the files from.
   * @param options - The available options.
   * @returns The loaded Glob path files.
   */
  private async loadDirectoryFiles(
    pattern: string | string[],
    options: LoadDirectoryFilesOptions = {
      includeFolders: false,
    },
  ): Promise<Path[]> {
    const { includeFolders } = options;
    const loadedPaths = await glob(pattern, {
      ignore: ["node_modules"],
      withFileTypes: true,
    });

    if (includeFolders) {
      return loadedPaths;
    }

    const filteredFiles = loadedPaths.filter(
      (file) => file.isFile() && (file.name.endsWith(".js") || file.name.endsWith(".ts")),
    );

    return filteredFiles;
  }

  /**
   * Creates a compatible path from a given Glob path to import.
   * @param path - The Glob path object to resolve.
   * @returns The resolved path.
   */
  private resolvePath(path: Path): string {
    return `file://${resolve(path.parentPath, path.name)}`;
  }

  /**
   * Upserts the application commands.
   * @param applicationCommands - The application commands to upsert.
   */
  private async upsertApplicationCommands(applicationCommands: CreateApplicationCommand[]): Promise<void> {
    const { helpers } = client;

    await helpers.upsertGlobalApplicationCommands(applicationCommands);
  }
}

type AnyCommand = ChatInputCommand | UserContextCommand;
type AnySubCommand = ChatInputSubCommand | ChatInputSubCommandGroup;

interface LoadDirectoryFilesOptions {
  /** Whether to include folder paths. */
  includeFolders?: boolean;
}
