import { z } from "zod";
import { PresenceUpdateSchema } from "./PresenceUpdateSchema.js";
import { RequestShardInformationSchema } from "./RequestShardInformation.js";

export const PayloadSchema = z.union([PresenceUpdateSchema, RequestShardInformationSchema]);

export enum PayloadType {
  PresenceUpdate = "PresenceUpdate",
  RequestShardInformation = "RequestShardInformation",
}

export type PayloadSchemaDto = z.infer<typeof PayloadSchema>;
