import { ComponentTypes, type TextInput, TextInputStyles } from "oceanic.js";

export class TextInputBuilder {
  #json: TextInput;

  constructor() {
    this.#json = {
      customID: "",
      label: "",
      style: TextInputStyles.SHORT,
      type: ComponentTypes.TEXT_INPUT,
    };
  }

  setCustomID(id: string): this {
    this.#json.customID = id;

    return this;
  }

  setLabel(label: string): this {
    this.#json.label = label;

    return this;
  }

  setMaxLength(length: number): this {
    this.#json.maxLength = length;

    return this;
  }

  setMinLength(length: number): this {
    this.#json.minLength = length;

    return this;
  }

  setPlaceholder(placeholder: string): this {
    this.#json.placeholder = placeholder;

    return this;
  }

  setRequired(required: boolean): this {
    this.#json.required = required;

    return this;
  }

  setStyle(style: TextInputStyles): this {
    this.#json.style = style;

    return this;
  }

  setValue(value: string): this {
    this.#json.value = value;

    return this;
  }

  toJSON(): TextInput {
    return this.#json;
  }
}
