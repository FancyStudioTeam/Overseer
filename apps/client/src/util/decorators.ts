import type { PermissionStrings } from "@discordeno/bot";
import type { ChatInputCommand, ChatInputCommandOptions } from "@structures/commands/ChatInputCommand.js";
import type { ChatInputSubCommand, ChatInputSubCommandOptions } from "@structures/commands/ChatInputSubCommand.js";
import type { UserContextCommand, UserContextCommandOptions } from "@structures/commands/UserContextCommand.js";

/**
 * Sets the "_autoLoad" property to "true" from the chat input command instance.
 * @returns The updated chat input command instance.
 */
export const AutoLoad =
  <Target extends ChatInputCommandInstance>() =>
  (target: Target) =>
    class extends target {
      _autoLoad = true;
    };

/**
 * Declares the command data to register it in the application.
 * @param options - The available options.
 * @returns The updated declarable command instance.
 */
export const Declare =
  <Target extends AnyDeclarableCommand>(options: DeclareOptions<Target>) =>
  (target: Target) =>
    class extends target {
      _registerOptions = options;
    };

/**
 * Sets the command options to manage the command.
 * @param options - The available options.
 * @returns The updated chat input sub command instance.
 */
export const CommandOptions =
  <Target extends ChatInputSubCommandInstance>(options: CommandOptionsData = {}) =>
  (target: Target) =>
    // @ts-expect-error
    class extends target {
      _options = options;
    };

export interface CommandOptionsData {
  /** Whether the interaction should be deferred. */
  deferReply?: boolean;
  /**
   * The required command permissions.
   * Using an array will interpret these permissions as the required user permissions.
   */
  permissions?: PermissionStrings[] | CommandOptionsPermissions;
}

export interface CommandOptionsPermissions {
  /** The required client permissions for the command. */
  client?: PermissionStrings[];
  /** The required user permissions for the command. */
  user?: PermissionStrings[];
}

// biome-ignore lint/suspicious/noExplicitAny: TypeScript issues.
type Instance<T> = new (...args: any[]) => T;

type ChatInputCommandInstance = Instance<ChatInputCommand>;
type ChatInputSubCommandInstance = Instance<ChatInputSubCommand>;
type UserContextCommandInstance = Instance<UserContextCommand>;

type AnyDeclarableCommand = ChatInputCommandInstance | ChatInputSubCommandInstance | UserContextCommandInstance;

type DeclareOptions<DeclarableInstance extends AnyDeclarableCommand> =
  DeclarableInstance extends ChatInputCommandInstance
    ? ChatInputCommandOptions
    : DeclarableInstance extends ChatInputSubCommandInstance
      ? ChatInputSubCommandOptions
      : UserContextCommandOptions;
