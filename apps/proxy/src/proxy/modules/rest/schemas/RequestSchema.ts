import { z } from "zod";

export const RequestSchema = z.object({}).passthrough().optional();

export type RequestSchemaDto = z.infer<typeof RequestSchema>;
