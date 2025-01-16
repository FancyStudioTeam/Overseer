import type { ChatInputCommand } from "./handlers.js";

/**
 * Sets "_autoLoad" property to true in the target class.
 * @returns The updated target class.
 */
export const AutoLoad = () => {
  return (target: {
    new (...args: unknown[]): ChatInputCommand;
  }) =>
    class extends target {
      _autoLoad = true;
    };
};
