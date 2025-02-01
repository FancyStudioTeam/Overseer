import "dotenv/config";
import { Importer } from "@structures/Loader.js";
import { type Client, client } from "@util/client.js";

/** Export the client object with its type. */
export { client, type Client };

/** Import all the required files to work. */
new Importer().import();
