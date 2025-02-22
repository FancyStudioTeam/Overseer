import { z } from "zod";

export const RequestSchema = z.object({}).passthrough();

export type RequestSchemaDto = z.infer<typeof RequestSchema>;
