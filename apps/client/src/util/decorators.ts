import type { ChatInputCommand } from "./handlers.js";

export const AutoLoad = () => {
  return (target: {
    // biome-ignore lint/suspicious/noExplicitAny:
    new (...args: any[]): ChatInputCommand;
  }) =>
    class extends target {
      _autoLoad = true;
    };
};
