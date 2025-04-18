import type { DiscordGatewayPayload } from "@discordeno/bot";
import { EVENTS_AUTHORIZATION } from "@util/config.js";
import { logger } from "@util/logger.js";
import { getErrorInstance } from "./getErrorInstance.js";

/**
 * Creates a request to the events proxy.
 * @param url - The events proxy url.
 * @param body - An object with the payload and shard id.
 */
export const makeEventsRequest = async (url: string, body: MakeEventsRequestBody): Promise<void> => {
  const headers = {
    authorization: EVENTS_AUTHORIZATION,
    "content-type": "application/json",
  };
  const fetchOptions: RequestInit = {
    body: JSON.stringify(body),
    headers,
    method: "POST",
  };

  await fetch(url, fetchOptions).catch((fetchError) => {
    const { stack } = getErrorInstance(fetchError);

    logger.error(stack);
  });
};

export interface MakeEventsRequestBody {
  /** The Discord payload to send. */
  payload: DiscordGatewayPayload;
  /** The shard id from which the payload was received. */
  // biome-ignore lint/style/useNamingConvention: Properties should be in snake case.
  shard_id: number;
}
