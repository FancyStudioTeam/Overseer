import {
  type ButtonComponent,
  ButtonStyles,
  ComponentTypes,
  type NullablePartialEmoji,
  type TextButton,
  type URLButton,
} from "oceanic.js";

export default class ButtonBuilder {
  private readonly json: ButtonComponent;

  constructor(button?: ButtonComponent) {
    this.json = button ?? {
      customID: "",
      style: ButtonStyles.SECONDARY,
      type: ComponentTypes.BUTTON,
    };
  }

  setCustomID(id: string): this {
    (<TextButton>this.json).customID = id;

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
    (<URLButton>this.json).url = url;

    return this;
  }

  toJSON(): ButtonComponent {
    return this.json;
  }
}
