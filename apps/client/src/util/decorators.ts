import type { CreateApplicationCommand, PermissionStrings } from "@discordeno/bot";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";

/**
 * Sets the "_autoLoad" property to "true" from the target instance.
 * @returns The updated target instance.
 */
export const AutoLoad =
  () =>
  <Target extends AnyInstance>(target: Target) =>
    class extends target {
      _autoLoad = true;
    };

/**
 * Declares the command to register it in the application.
 * @param options - The available options.
 * @returns The updated target instance.
 */
export const Declare =
  (options: CreateApplicationCommand) =>
  <Target extends AnyInstance>(target: Target) =>
    class extends target {
      _data = options;
    };

/**
 * Sets the command options to manage the command.
 * @param options - The available options.
 * @returns The updated target instance.
 */
export const CommandOptions =
  (options: CommandOptionsData = {}) =>
  (target: {
    new (...args: unknown[]): ChatInputSubCommand;
  }) =>
    // @ts-expect-error
    class extends target {
      constructor() {
        super();

        Object.assign(this._commandOptions, options);
      }
    };

export interface CommandOptionsData {
  /** Whether the interaction should be deferred. */
  deferReply?: boolean;
  /**
   * The required command permissions.
   * Using an array will interpret these permissions as the required user permissions.
   */
  // TODO: Change "permissions" to an array.
  permissions?: PermissionStrings | CommandOptionsPermissions;
}

export interface CommandOptionsPermissions {
  /** The required client permissions for the command. */
  client?: PermissionStrings;
  /** The required user permissions for the command. */
  user?: PermissionStrings;
}

// biome-ignore lint/suspicious/noExplicitAny: TypeScript issues.
type AnyInstance = new (...args: any[]) => object;
