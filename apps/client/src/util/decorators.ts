import type { PermissionStrings } from "@discordeno/bot";
import type { ChatInputCommand, ChatInputCommandOptions } from "@structures/commands/ChatInputCommand.js";
import type { ChatInputSubCommand, ChatInputSubCommandOptions } from "@structures/commands/ChatInputSubCommand.js";
import type {
  ChatInputSubCommandGroup,
  ChatInputSubCommandGroupOptions,
} from "@structures/commands/ChatInputSubCommandGroup.js";
import type { UserContextCommand, UserContextCommandOptions } from "@structures/commands/UserContextCommand.js";
import type { ButtonComponent, ButtonComponentOptions } from "@structures/components/ButtonComponent.js";
import type { ModalComponent, ModalComponentOptions } from "@structures/components/ModalComponent.js";

/**
 * Sets the "_autoLoad" property to "true" from the command instance.
 * @returns The updated command instance.
 */
export const AutoLoad =
  <Target extends AnyAutoLoadableParent>() =>
  (target: Target) =>
    class extends target {
      _autoLoad = true;
    };

/**
 * Declares the declarable data from the declarable instance.
 * @param options - The available options.
 * @returns The updated declarable command instance.
 */
export const Declare =
  <Target extends AnyDeclarableInstance>(options: DeclareOptions<Target>) =>
  (target: Target) =>
    class extends target {
      _declareDecoratorData = options;
    };

/**
 * Sets the command options to manage the command.
 * @param options - The available options.
 * @returns The updated chat input sub command instance.
 */
export const CommandOptions =
  <Target extends ChatInputSubCommandInstance>(options: CommandOptionsData = {}) =>
  (target: Target) =>
    // @ts-expect-error
    class extends target {
      _options = options;
    };

export interface CommandOptionsData {
  /** Whether the interaction should be deferred. */
  deferReply?: boolean;
  /**
   * The required command permissions.
   * Using an array will interpret these permissions as the required user permissions.
   */
  permissions?: PermissionStrings[] | CommandOptionsPermissions;
}

export interface CommandOptionsPermissions {
  /** The required client permissions for the command. */
  client?: PermissionStrings[];
  /** The required user permissions for the command. */
  user?: PermissionStrings[];
}

// biome-ignore lint/suspicious/noExplicitAny: TypeScript issues.
type Instance<T> = new (...args: any[]) => T;

type ButtonComponentInstance = Instance<ButtonComponent>;
type ModalComponentInstance = Instance<ModalComponent>;

type ChatInputCommandInstance = Instance<ChatInputCommand>;
type ChatInputSubCommandGroupInstance = Instance<ChatInputSubCommandGroup>;
type ChatInputSubCommandInstance = Instance<ChatInputSubCommand>;
type UserContextCommandInstance = Instance<UserContextCommand>;

type AnyAutoLoadableParent = ChatInputCommandInstance | ChatInputSubCommandGroupInstance;
type AnyDeclarableCommand =
  | ChatInputCommandInstance
  | ChatInputSubCommandGroupInstance
  | ChatInputSubCommandInstance
  | UserContextCommandInstance;
type AnyDeclarableComponent = ButtonComponentInstance | ModalComponentInstance;
type AnyDeclarableInstance = AnyDeclarableComponent | AnyDeclarableCommand;

type DeclareOptions<DeclarableInstance extends AnyDeclarableInstance> =
  DeclarableInstance extends ButtonComponentInstance
    ? ButtonComponentOptions
    : DeclarableInstance extends ChatInputCommandInstance
      ? ChatInputCommandOptions
      : DeclarableInstance extends ChatInputSubCommandGroupInstance
        ? ChatInputSubCommandGroupOptions
        : DeclarableInstance extends ChatInputSubCommandInstance
          ? ChatInputSubCommandOptions
          : DeclarableInstance extends ModalComponentInstance
            ? ModalComponentOptions
            : DeclarableInstance extends UserContextCommandInstance
              ? UserContextCommandOptions
              : never;
