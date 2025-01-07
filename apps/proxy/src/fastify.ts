import { NODE_ENV, PROXY_ALLOWED_IPS, PROXY_AUTHORIZATION, PROXY_HOST, PROXY_PORT } from "@config";
import { STATUS_CODE_LABELS } from "@util/constants.js";
import { logger } from "@util/logger.js";
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
    (_, address) => logger.http(`Initialized proxy server at address "${address}"`),
  );

  app.addHook("onRequest", (request, response, done) => {
    logger.http(`Received "${request.method}" request to "${request.url}" from "${request.ip}"`);

    if (NODE_ENV === "production" && !PROXY_ALLOWED_IPS.includes(request.ip)) {
      return response.status(403).send();
    }

    if (request.headers.authorization !== PROXY_AUTHORIZATION) {
      return response.status(401).send();
    }

    return done();
  });

  app.addHook("onResponse", (request, response, done) => {
    logger.http(`Sent "${STATUS_CODE_LABELS[response.statusCode]}" status code to "${request.url}"`);

    return done();
  });

  return app;
};
