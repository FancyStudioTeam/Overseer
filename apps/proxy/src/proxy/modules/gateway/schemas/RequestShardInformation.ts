import { z } from "zod";

const RequestShardInformationGuildIdSchema = z.string().optional();

export const RequestShardInformationSchema = z.object({
  // biome-ignore lint/style/useNamingConvention: Properties should be in snake case.
  guild_id: RequestShardInformationGuildIdSchema,
});

export type RequestShardInformationSchemaDto = z.infer<typeof RequestShardInformationSchema>;
