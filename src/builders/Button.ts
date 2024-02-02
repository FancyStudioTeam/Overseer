import {
  ButtonComponent,
  ButtonStyles,
  ComponentTypes,
  type NullablePartialEmoji,
  type TextButton,
  type URLButton,
} from "oceanic.js";

export class ButtonBuilder {
  private json: TextButton | URLButton;

  constructor() {
    this.json = {
      customID: "",
      style: ButtonStyles.SECONDARY,
      type: ComponentTypes.BUTTON,
    };
  }

  setCustomID(id: string): this {
    (this.json as TextButton).customID = id;

    return this;
  }

  setDisabled(disabled: boolean): this {
    this.json.disabled = disabled;

    return this;
  }

  setEmoji(emoji: NullablePartialEmoji): this {
    this.json.emoji = {
      id: emoji.id ?? "",
      name: emoji.name ?? "",
    };

    return this;
  }

  setLabel(label: string): this {
    this.json.label = label;

    return this;
  }

  setStyle(style: ButtonStyles): this {
    this.json.style = style;

    return this;
  }

  setURL(url: string): this {
    if (this.json.style !== ButtonStyles.LINK) {
      throw new Error(
        `Cannot establish a link on a button of type "${this.json.style}"`,
      );
    }

    (this.json as URLButton).url = url;

    return this;
  }

  toJSON(): ButtonComponent {
    return this.json;
  }

  load(button: ButtonComponent): this {
    this.json = button;

    return this;
  }
}
