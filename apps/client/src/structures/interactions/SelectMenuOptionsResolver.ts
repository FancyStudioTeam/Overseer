import type { Interaction } from "@util/types.js";

export class SelectMenuOptionsResolver {
  private readonly values: string[];

  constructor(interaction: Interaction) {
    const { data } = interaction;
    const { values } = data ?? {};

    this.values = values ?? [];
  }

  /**
   * Gets the string values.
   * @returns An array containing the string values.
   */
  getStrings(): string[] {
    const values = this.getValues();

    return values;
  }

  /**
   * Gets the raw values.
   * @returns An array containing the raw values.
   */
  private getValues(): string[] {
    return this.values;
  }
}
