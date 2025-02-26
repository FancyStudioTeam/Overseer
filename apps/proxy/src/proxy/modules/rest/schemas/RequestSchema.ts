import { z } from "zod";

export const RequestSchema = z.unknown();

export type RequestSchemaDto = z.infer<typeof RequestSchema>;
