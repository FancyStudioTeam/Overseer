import { PROXY_AUTHORIZATION, PROXY_HOST, PROXY_PORT } from "@config";
import { logger } from "@util/Logger.js";
import Fastify from "fastify";

export const createFastifyApp = () => {
  const app = Fastify({
    trustProxy: true,
  });

  app.listen(
    {
      host: PROXY_HOST,
      port: Number.parseInt(PROXY_PORT),
    },
    (_, address) => logger.http(`Listening proxy server at ${address}`),
  );

  app.addHook("onRequest", (request, response, done) => {
    logger.http(`Received ${request.method} request to "${request.url}" from "${request.ip}"`);

    if (request.headers.authorization !== PROXY_AUTHORIZATION) {
      return response.status(401).send({
        message: "Unauthorized",
      });
    }

    return done();
  });

  app.addHook("onResponse", (request, response, done) => {
    logger.http(`Sent status code ${response.statusCode} to "${request.url}"`);

    return done();
  });

  return app;
};
