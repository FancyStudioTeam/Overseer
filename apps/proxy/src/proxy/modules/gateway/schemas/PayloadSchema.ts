import type { z } from "zod";
import { PresenceUpdateSchema } from "./PresenceUpdateSchema.js";

export const PayloadSchema = PresenceUpdateSchema;

export enum PayloadType {
  PresenceUpdate = "PresenceUpdate",
}

export type PayloadSchemaDto = z.infer<typeof PayloadSchema>;
