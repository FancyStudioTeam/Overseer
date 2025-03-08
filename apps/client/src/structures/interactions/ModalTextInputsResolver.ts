import {
  type ActionRow,
  Collection,
  type Component,
  type InputTextComponent,
  type MessageComponent,
  MessageComponentTypes,
} from "@discordeno/bot";
import type { Interaction, MaybeOptional } from "@util/types.js";

export class ModalTextInputsResolver {
  private readonly interactionComponents: Component[];

  constructor(interaction: Interaction) {
    const { data } = interaction;
    const { components } = data ?? {};

    this.interactionComponents = components ?? [];
  }

  /**
   * Gets all the components from the action row components.
   * @returns An array containing all the component objects from the action row components.
   */
  private getComponentsFromActionRowComponents(): MessageComponent[] {
    const { interactionComponents } = this;
    const actionRowComponents = interactionComponents.filter(
      ({ type: componentType }) => componentType === MessageComponentTypes.ActionRow,
    ) as ActionRow[];
    /** Flat the components array from the action row components into a single array. */
    const componentsFromActionRow = actionRowComponents.flatMap(({ components }) => components);

    return componentsFromActionRow;
  }

  /**
   * Gets the available text input components from the action row components.
   * @returns A collection containing the available text input components.
   */
  private getTextInputComponents(): Collection<string, string> {
    const textInputComponentsCollection = new Collection<string, string>();
    const componentsFromActionRow = this.getComponentsFromActionRowComponents();
    const textInputComponents = componentsFromActionRow.filter(
      ({ type: componentType }) => componentType === MessageComponentTypes.InputText,
    ) as InputTextComponent[];

    for (const textInputComponent of textInputComponents) {
      const { customId, value } = textInputComponent;

      if (!value) {
        continue;
      }

      textInputComponentsCollection.set(customId, value);
    }

    return textInputComponentsCollection;
  }

  /**
   * Gets the value of a text input component.
   * @param customId - The text input component custom id.
   * @param required - Whether the text input component is required.
   * @returns The text input component value.
   *
   * @remarks If the text input component was not found and the required parameter is set to "true", it will throw an error.
   */
  getTextInputValue<Required extends boolean>(customId: string, required?: Required): TextInputValue<Required> {
    const textInputComponents = this.getTextInputComponents();
    const textInputComponentValue = textInputComponents.get(customId);

    if (!textInputComponentValue) {
      if (required) {
        throw new Error(`Cannot find text input component with custom id "${customId}".`);
      }

      return undefined as TextInputValue<Required>;
    }

    return textInputComponentValue;
  }
}

type TextInputValue<Required extends boolean> = Required extends true ? string : MaybeOptional<string>;
