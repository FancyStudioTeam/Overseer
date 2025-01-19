import type { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";

/**
 * Sets "_autoLoad" property to true in the target class.
 * @returns The updated target class.
 */
export const AutoLoad =
  () =>
  (target: {
    new (...args: unknown[]): ChatInputCommand;
  }) =>
    /**
     * Returns the updated target class.
     */
    class extends target {
      _autoLoad = true;
    };
