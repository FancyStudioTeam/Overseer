import { EVENTS_ALLOWED_IPS, EVENTS_AUTHORIZATION, EVENTS_HOST, EVENTS_PORT, NODE_ENV } from "@config";
import { STATUS_CODE_LABELS } from "@util/Constants.js";
import { logger } from "@util/Logger.js";
import Fastify from "fastify";

export const createFastifyApp = () => {
  const app = Fastify({
    trustProxy: true,
  });

  app.listen(
    {
      host: EVENTS_HOST,
      port: Number.parseInt(EVENTS_PORT),
    },
    (_, address) => logger.http(`Initialized proxy server at address "${address}"`),
  );

  app.addHook("onRequest", (request, response, done) => {
    logger.http(`Received "${request.method}" request to "${request.url}" from "${request.ip}"`);

    if (NODE_ENV === "production" && !EVENTS_ALLOWED_IPS.includes(request.ip)) {
      return response.status(403).send();
    }

    if (request.headers.authorization !== EVENTS_AUTHORIZATION) {
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
