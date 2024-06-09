import {
  type ChannelSelectMenu,
  type ChannelTypes,
  ComponentTypes,
  type SelectMenuComponent,
  type SelectMenuDefaultValue,
  type SelectOption,
  type StringSelectMenu,
} from "oceanic.js";

export default class SelectMenuBuilder {
  private readonly json: SelectMenuComponent;

  constructor() {
    this.json = {
      customID: "",
      options: [],
      type: ComponentTypes.STRING_SELECT,
    };
  }

  setChannelTypes(types: ChannelTypes[]): this {
    (<ChannelSelectMenu>this.json).channelTypes = types;

    return this;
  }

  setCustomID(id: string): this {
    this.json.customID = id;

    return this;
  }

  setDefaultValues(values: SelectMenuDefaultValue[]): this {
    (<ChannelSelectMenu>this.json).defaultValues = values;

    return this;
  }

  setDisabled(disabled: boolean): this {
    this.json.disabled = disabled;

    return this;
  }

  setMaxValues(value: number): this {
    this.json.maxValues = value;

    return this;
  }

  setMinValues(value: number): this {
    this.json.minValues = value;

    return this;
  }

  addOptions(components: SelectOption[]): this {
    for (const component of components) {
      (<StringSelectMenu>this.json).options.push(component);
    }

    return this;
  }

  setPlaceholder(placeholder: string): this {
    this.json.placeholder = placeholder;

    return this;
  }

  setType(type: ValidType): this {
    this.json.type = type;

    return this;
  }

  toJSON(): SelectMenuComponent {
    return this.json;
  }
}

type ValidType =
  | ComponentTypes.CHANNEL_SELECT
  | ComponentTypes.MENTIONABLE_SELECT
  | ComponentTypes.ROLE_SELECT
  | ComponentTypes.STRING_SELECT
  | ComponentTypes.USER_SELECT;
