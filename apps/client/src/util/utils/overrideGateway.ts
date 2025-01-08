import { PROXY_AUTHORIZATION, PROXY_URL } from "@config";
import type { Client } from "@index";

export const overrideGateway = (client: Client) => {
  client.gateway.sendPayload = async (shardId, payload) => {
    await fetch(`${PROXY_URL}/gateway`, {
      body: JSON.stringify({
        type: "ShardPayload",
        shardId,
        payload,
      }),
      headers: {
        authorization: PROXY_AUTHORIZATION,
        "content-type": "application/json",
      },
      method: "POST",
    });
  };
};
