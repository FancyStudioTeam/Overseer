import { ComponentTypes, type MessageActionRow } from "oceanic.js";
import type { ButtonBuilder, SelectMenuBuilder } from "#builders";

export class ActionRowBuilder {
  #json: MessageActionRow;

  constructor() {
    this.#json = {
      components: [],
      type: ComponentTypes.ACTION_ROW,
    };
  }

  addComponents(components: ValidComponent[]): this {
    components.forEach((component, _) => {
      this.#json.components.push(component.toJSON());
    });

    return this;
  }

  toJSON(): MessageActionRow {
    return this.#json;
  }

  toJSONArray(): MessageActionRow[] {
    return [this.#json];
  }
}

type ValidComponent = ButtonBuilder | SelectMenuBuilder;