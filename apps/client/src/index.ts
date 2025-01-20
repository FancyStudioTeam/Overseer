import "dotenv/config";
import { type Client, client } from "@util/client.js";
import { initLoader } from "@util/loader.js";

/**
 * Exports the client object with its type.
 */
export { client, type Client };

/**
 * Dynamically imports the client API after exporting the client object to avoid circular imports.
 */
import("@api");
await initLoader();
