import "dotenv/config";

import helmet from "@fastify/helmet";
import { createFastifyApp } from "./fastify.js";
import { Routes } from "./routes/index.js";

export const app = createFastifyApp();

app.register(helmet);
app.register(Routes);
