import type { File } from "oceanic.js";

export default class AttachmentBuilder {
  private readonly json: File;

  constructor() {
    this.json = {
      contents: Buffer.alloc(0),
      index: 0,
      name: "",
    };
  }

  setContent(content: Buffer): this {
    this.json.contents = content;

    return this;
  }

  setName(name: string): this {
    this.json.name = name;

    return this;
  }

  setIndex(index: number): this {
    this.json.index = index;

    return this;
  }

  toJSON(): File {
    return this.json;
  }

  toJSONArray(): File[] {
    return [this.json];
  }
}
