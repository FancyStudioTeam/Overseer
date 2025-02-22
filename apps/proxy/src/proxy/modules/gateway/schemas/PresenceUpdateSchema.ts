import { ActivityTypes, PresenceStatus } from "@discordeno/bot";
import { z } from "zod";
import { PayloadType } from "./PayloadSchema.js";

const PresenceUpdateActivityNameSchema = z.string().min(1).max(100);
const PresenceUpdateActivityStateSchema = z.string().min(1).max(100).optional();
const PresenceUpdateActivityTypeSchema = z.nativeEnum(ActivityTypes);
const PresenceUpdateActivityUrlSchema = z.string().url().optional();

const PresenceActivitySchema = z.object({
  name: PresenceUpdateActivityNameSchema,
  state: PresenceUpdateActivityStateSchema,
  type: PresenceUpdateActivityTypeSchema,
  url: PresenceUpdateActivityUrlSchema,
});
const PresenceUpdateStatusSchema = z.nativeEnum(PresenceStatus);

const PresenceUpdateActivitiesSchema = z.array(PresenceActivitySchema);

export const PresenceUpdateSchema = z
  .object({
    activities: PresenceUpdateActivitiesSchema,
    status: PresenceUpdateStatusSchema,
  })
  .transform((value) => ({
    payload: value,
    type: PayloadType.PresenceUpdate as const,
  }));
