import type { TextInputBuilder } from "oceanic-builders";
import { ComponentTypes, type ModalData } from "oceanic.js";

export default class ModalBuilder {
  private readonly json: ModalData;

  constructor() {
    this.json = {
      components: [],
      customID: "",
      title: "",
    };
  }

  setCustomID(id: string): this {
    this.json.customID = id;

    return this;
  }

  setTitle(title: string): this {
    this.json.title = title;

    return this;
  }

  addComponents(components: TextInputBuilder[]): this {
    for (const component of components) {
      this.json.components.push({
        type: ComponentTypes.ACTION_ROW,
        components: [component.toJSON()],
      });
    }

    return this;
  }

  toJSON(): ModalData {
    return this.json;
  }
}
