import type {
  ChatInputCommandInterface,
  ChatInputSubCommandInterface,
  ComponentInterface,
  ModalInterface,
  UserCommandInterface,
} from "#types";

export class BaseBuilder<T extends BuilderTypes> {
  constructor(options: T) {
    Object.assign(this, options);
  }
}

type BuilderTypes =
  | ChatInputCommandInterface
  | ChatInputSubCommandInterface
  | UserCommandInterface
  | ComponentInterface
  | ModalInterface;
