import { z } from "zod";
import { PayloadType } from "./PayloadSchema.js";

const RequestShardInformationGuildIdSchema = z.string().optional();

export const RequestShardInformationSchema = z
  .object({
    // biome-ignore lint/style/useNamingConvention: Properties should be in snake case.
    guild_id: RequestShardInformationGuildIdSchema,
  })
  .transform((value) => ({
    payload: value,
    type: PayloadType.RequestShardInformation as const,
  }));
