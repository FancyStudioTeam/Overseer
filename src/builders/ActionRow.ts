import { ComponentTypes, type MessageActionRow } from "oceanic.js";
import type { ButtonBuilder } from "./Button";
import type { SelectMenuBuilder } from "./SelectMenu";

export class ActionRowBuilder {
  private json: MessageActionRow;

  constructor() {
    this.json = {
      components: [],
      type: ComponentTypes.ACTION_ROW,
    };
  }

  addComponents(components: ValidComponent[]): this {
    components.forEach((c, _) => {
      this.json.components.push(c.toJSON());
    });

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
