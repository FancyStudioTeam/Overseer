import type { ChatInputCommand, ChatInputSubCommand, Component, Modal, UserCommand } from "#types";

export class Base<T extends BaseTypes> {
  constructor(options: T) {
    Object.assign(this, options);
  }
}

type BaseTypes = ChatInputCommand | ChatInputSubCommand | UserCommand | Component | Modal;
