import type { ButtonBuilder } from "oceanic-builders";
import { ComponentTypes, type MessageActionRow } from "oceanic.js";
import type { SelectMenuBuilder } from "#builders";

export default class ActionRowBuilder {
  private readonly json: MessageActionRow;

  constructor() {
    this.json = {
      components: [],
      type: ComponentTypes.ACTION_ROW,
    };
  }

  addComponents(components: ValidComponent[]): this {
    for (const component of components) {
      this.json.components.push(component.toJSON());
    }

    return this;
  }

  toJSON(): MessageActionRow {
    return this.json;
  }

  toJSONArray(): MessageActionRow[] {
    return [this.json];
  }
}

type ValidComponent = ButtonBuilder | SelectMenuBuilder;
