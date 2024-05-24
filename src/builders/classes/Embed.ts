import type {
  Embed,
  EmbedAuthorOptions,
  EmbedField,
  EmbedFooterOptions,
  EmbedOptions,
} from "oceanic.js";

export class EmbedBuilder {
  private json: Embed;

  constructor() {
    this.json = {};
  }

  setAuthor(author: EmbedAuthorOptions): this {
    this.json.author = {
      iconURL: author.iconURL ?? "",
      name: author.name ?? "",
      url: author.url,
    };

    return this;
  }

  setColor(color: number): this {
    this.json.color = color;

    return this;
  }

  setDescription(description: string): this {
    this.json.description = description;

    return this;
  }

  addField(field: EmbedField): this {
    this.json.fields = this.json.fields?.length
      ? [...this.json.fields, field]
      : [field];

    return this;
  }

  addFields(fields: EmbedField[]): this {
    fields.forEach((f, _) => {
      this.addField(f);
    });

    return this;
  }

  setFooter(footer: EmbedFooterOptions): this {
    this.json.footer = {
      iconURL: footer.iconURL ?? "",
      text: footer.text ?? "",
    };

    return this;
  }

  setImage(image: string): this {
    this.json.image = {
      url: image,
    };

    return this;
  }

  setThumbnail(thumbnail: string): this {
    this.json.thumbnail = {
      url: thumbnail,
    };

    return this;
  }

  setTimestamp(timestamp?: string): this {
    this.json.timestamp = timestamp ? timestamp : new Date().toISOString();

    return this;
  }

  setTitle(title: string): this {
    this.json.title = title;

    return this;
  }

  setURL(url: string): this {
    this.json.url = url;

    return this;
  }

  toJSON(): EmbedOptions {
    return this.json;
  }

  toJSONArray(): EmbedOptions[] {
    return [this.json];
  }

  load(embed: EmbedOptions): this {
    this.json = embed;

    return this;
  }
}
