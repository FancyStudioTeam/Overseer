import type { GuildConfigurationLocale } from "@prisma/client";
import type {
  ComponentType,
  createButtonComponent,
  createChatInputCommand,
  createChatInputSubCommand,
  createMessageCommand,
  createModalComponent,
  createPrefixCommand,
  createSelectMenuComponent,
  createUserCommand,
} from "@util/Handlers";
import type {
  AnyInteractionGateway,
  CreateMessageOptions,
  EmbedOptions,
  InteractionContent,
  Message,
} from "oceanic.js";

export type Locales = GuildConfigurationLocale;

export type MaybeAwaitable<T> = Promise<T> | T;
export type MaybeNullish<T> = T | null | undefined;

export type ButtonComponentData = ReturnType<typeof createButtonComponent> & {
  type: ComponentType.BUTTON;
};
export type ChatInputCommandData = ReturnType<typeof createChatInputCommand>;
export type ChatInputSubCommandData = ReturnType<typeof createChatInputSubCommand>;
export type MessageCommandData = ReturnType<typeof createMessageCommand>;
export type ModalComponentData = ReturnType<typeof createModalComponent> & {
  type: ComponentType.MODAL;
};
export type PrefixCommandData = ReturnType<typeof createPrefixCommand>;
export type SelectMenuComponentData = ReturnType<typeof createSelectMenuComponent> & {
  type: ComponentType.SELECT_MENU;
};
export type UserCommandData = ReturnType<typeof createUserCommand>;

export type AnyMessagePayload = string | EmbedOptions | CreateMessageOptions;
export type MessagePayload = CreateMessageOptions & InteractionContent;

export type AnyContext = AnyInteractionGateway | Message;
