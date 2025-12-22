import { loadEnvFile } from "node:process";
import { Client } from "linkcord";

loadEnvFile();

export const client = new Client();

client.init().catch(console.error);
