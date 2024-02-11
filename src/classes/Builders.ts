import type { ClientEvents } from "oceanic.js";
import type {
  ChatInputCommandInterface,
  ComponentInterface,
  ModalInterface,
  SubCommandInterface,
  UserCommandInterface,
} from "../types";

class Base {
  constructor(options: any) {
    Object.assign(this, options);
  }
}

export class Component extends Base {
  constructor(options: ComponentInterface) {
    super(options);
  }
}

export class Modal extends Base {
  constructor(options: ModalInterface) {
    super(options);
  }
}

export class Event<Key extends keyof ClientEvents> extends Base {
  constructor(
    public event: Key,
    public once: boolean,
    public run: (...args: ClientEvents[Key]) => unknown,
  ) {
    super({ event, once, run });
  }
}

export class ChatInputCommand extends Base {
  constructor(commandOptions: ChatInputCommandInterface) {
    super(commandOptions);
  }
}

export class SubCommand extends Base {
  constructor(commandOptions: SubCommandInterface) {
    super(commandOptions);
  }
}

export class UserCommand extends Base {
  constructor(commandOptions: UserCommandInterface) {
    super(commandOptions);
  }
}
