import { ComponentTypes, type ModalData } from "oceanic.js";
import type { TextInputBuilder } from "#root/src/builders/Index";

export class ModalBuilder {
  #json: ModalData;

  constructor() {
    this.#json = {
      components: [],
      customID: "",
      title: "",
    };
  }

  setCustomID(id: string): this {
    this.#json.customID = id;

    return this;
  }

  setTitle(title: string): this {
    this.#json.title = title;

    return this;
  }

  addComponents(components: TextInputBuilder[]): this {
    components.forEach((c, _) => {
      this.#json.components.push({
        type: ComponentTypes.ACTION_ROW,
        components: [c.toJSON()],
      });
    });

    return this;
  }

  toJSON(): ModalData {
    return this.#json;
  }
}
