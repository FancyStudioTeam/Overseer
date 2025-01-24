import type { ChatInputCommand } from "@structures/commands/ChatInputCommand.js";

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
