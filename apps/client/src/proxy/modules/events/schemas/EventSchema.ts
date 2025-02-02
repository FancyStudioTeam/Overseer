import type { DiscordGatewayPayload } from "@discordeno/bot";
import { z } from "zod";

const PayloadSchema = z
  .object({})
  .passthrough()
  .transform<DiscordGatewayPayload>((payload) => payload as unknown as DiscordGatewayPayload);
const ShardIdSchema = z.number().int().gte(0);

export const EventSchema = z.object({
  payload: PayloadSchema,
  shardId: ShardIdSchema,
});

export type EventSchemaDto = z.infer<typeof EventSchema>;
