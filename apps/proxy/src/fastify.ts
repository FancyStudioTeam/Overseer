import { NODE_ENV, PROXY_ALLOWED_IPS, PROXY_AUTHORIZATION, PROXY_HOST, PROXY_PORT } from "@config";
import { loggerogger.jsLogger.js
import { STATUS_CODE_LABELS_CODE_LABELS_COconstants.js_COconstants.js } constants.jsil/constants.js";
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
