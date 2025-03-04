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
 * Declares the instance data to the declarable instance.
 * @param options - The available options.
 * @returns The updated declarable instance.
 */
export const Declare =
  <Target extends AnyDeclarableInstance>(options: DeclareOptions<Target>) =>
  (target: Target) =>
    class extends target {
      _declareDecoratorData = options;
    };

/**
 * Sets the instance options to the runnable instance.
 * @param options - The available options.
 * @returns The updated declarable instance.
 */
export const InstanceOptions =
  <Target extends AnyRunnableInstance>(options: RunnableInstanceOptions = {}) =>
  (target: Target) =>
    class extends target {
      _instanceOptions = options;
    };

export interface RunnableInstanceOptions {
  /** Whether the interaction should be deferred. */
  deferReply?: boolean;
  /**
   * The required instance permissions.
   * Using an array will interpret these permissions as the required user permissions.
   */
  permissions?: PermissionStrings[] | RunnableInstancePermissions;
}

export interface RunnableInstancePermissions {
  /** The required client permissions for the instance. */
  client?: PermissionStrings[];
  /** The required user permissions for the instance. */
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
type AnyRunnableInstance =
  | ButtonComponentInstance
  | ChatInputSubCommandInstance
  | ModalComponentInstance
  | UserContextCommandInstance;

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
