import { BadRequestException, type PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  // biome-ignore lint/style/noParameterProperties: Required by Nest.
  constructor(private readonly schema: ZodSchema) {}

  /**
   * Transforms a value to a parsed and validated value using Zod.
   * @param value - The value to parse and transform.
   * @returns The parsed and validated value.
   */
  transform(value: unknown): unknown {
    try {
      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (zodError) {
      throw new BadRequestException(zodError);
    }
  }
}
