import { z } from "zod";

const PayloadSchema = z.object({}).passthrough();
const ShardIdSchema = z.number().int().gte(0);

export const EventSchema = z.object({
  payload: PayloadSchema,
  shardId: ShardIdSchema,
});

export type EventSchemaType = z.infer<typeof EventSchema>;
