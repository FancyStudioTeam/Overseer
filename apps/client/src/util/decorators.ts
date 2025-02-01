import type { PermissionStrings } from "@discordeno/bot";
import type { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";
import type { ChatInputSubCommand } from "@structures/commands/ChatInputSubCommand.js";

/**
 * Set the "_autoLoad" property to "true" in the target instance.
 * @returns The updated target instance.
 */
export const AutoLoad =
  () =>
  (target: {
    new (...args: unknown[]): ChatInputCommand;
  }) =>
    class extends target {
      _autoLoad = true;
    };

/**
 * Set the command options to manage the command.
 * @returns The updated target instance.
 */
export const CommandOptions =
  ({ deferReply, permissions }: CommandOptionsData = {}) =>
  (target: {
    new (...args: unknown[]): ChatInputSubCommand;
  }) =>
    // @ts-expect-error
    class extends target {
      constructor() {
        super();

        this._commandOptions = {
          deferReply,
          permissions,
        };
      }
    };

export interface CommandOptionsData {
  /** Whether the interaction should be deferred. */
  deferReply?: boolean;
  /**
   * The required command permissions.
   * When using an array, the permissions will be interpreted as the required user permissions.
   */
  permissions?: PermissionStrings | CommandOptionsPermissions;
}

export interface CommandOptionsPermissions {
  /** The required client permissions. */
  client?: PermissionStrings;
  /** The required user permissions. */
  user?: PermissionStrings;
}
