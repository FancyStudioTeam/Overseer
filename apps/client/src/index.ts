import "dotenv/config";
import { type Client, client } from "@util/client.js";
import { initLoader } from "@util/loader.js";

/** Export the client object with its type. */
export { client, type Client };

// biome-ignore lint/complexity/noVoid: Execute the promise without any value and warnings.
void initLoader();
