import type { DiscordGatewayPayload } from "@discordeno/bot";
import { EVENTS_AUTHORIZATION } from "@util/config.js";
import { logger } from "@util/logger.js";
import { getErrorInstance } from "./getErrorInstance.js";

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
    /** Get the error instance from the fetch error exception. */
    const error = getErrorInstance(fetchError);

    logger.error(error.stack);
  });
};

export interface MakeEventsRequestBody {
  /** The Discord payload to sent. */
  payload: DiscordGatewayPayload;
  /** The shard id from which the payload was received. */
  shardId: number;
}
