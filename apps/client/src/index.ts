import "dotenv/config";
import "@api";
import { Discord } from "@structures/Discord.js";
import { initLoader } from "@util/loader.js";

const discord = new Discord();

export { discord, Discord };

await initLoader();
