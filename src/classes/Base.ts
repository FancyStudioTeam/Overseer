import type { ChatInputCommand, ChatInputSubCommand, Component, Modal, UserCommand } from "#types";

export class BaseBuilder<T extends BuilderTypes> {
  constructor(options: T) {
    Object.assign(this, options);
  }
}

type BuilderTypes = ChatInputCommand | ChatInputSubCommand | UserCommand | Component | Modal;
