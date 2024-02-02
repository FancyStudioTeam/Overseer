import type { ClientEvents } from "oceanic.js";
import type {
  ChatInputCommandInterface,
  ComponentInterface,
  ModalInterface,
  SubCommandInterface,
  UserCommandInterface,
} from "../types";

export class Component {
  constructor(options: ComponentInterface) {
    Object.assign(this, options);
  }
}

export class Modal {
  constructor(options: ModalInterface) {
    Object.assign(this, options);
  }
}

export class Event<Key extends keyof ClientEvents> {
  constructor(
    public event: Key,
    public once: boolean,
    public run: (...args: ClientEvents[Key]) => unknown,
  ) {}
}

export class ChatInputCommand {
  constructor(commandOptions: ChatInputCommandInterface) {
    Object.assign(this, commandOptions);
  }
}

export class SubCommand {
  constructor(commandOptions: SubCommandInterface) {
    Object.assign(this, commandOptions);
  }
}

export class UserCommand {
  constructor(commandOptions: UserCommandInterface) {
    Object.assign(this, commandOptions);
  }
}
