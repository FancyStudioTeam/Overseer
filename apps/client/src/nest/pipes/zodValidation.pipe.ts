import { type ArgumentMetadata, BadRequestException, type PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  // biome-ignore lint/style/noParameterProperties: Required by Nest.
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (zodError) {
      throw new BadRequestException(zodError);
    }
  }
}
