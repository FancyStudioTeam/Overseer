import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { GatewayRoutes } from "./gateway/index.js";
import { RestRoutes } from "./rest/index.js";

export const Routes = (app: FastifyInstance, _options: FastifyPluginOptions) => {
  app.register(RestRoutes, {
    prefix: "/rest",
  });
  app.register(GatewayRoutes, {
    prefix: "/gateway",
  });

  app.get("/timecheck", async (_request, response) =>
    response.status(200).send({
      message: Date.now(),
    }),
  );
};
