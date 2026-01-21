# Build

FROM node:22-slim AS build

WORKDIR /vanguard

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/client ./apps/client

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm --filter client build

# Runtime

FROM node:22-slim

WORKDIR /vanguard

COPY --from=build /vanguard/apps/client/dist ./dist
COPY --from=build /vanguard/apps/client/package.json ./
COPY --from=build /vanguard/apps/client/.env ./
COPY --from=build /vanguard/apps/client/linkcord-0.0.0.tgz ./
COPY --from=build /vanguard/apps/client/linkcord.config.js ./

ENV NODE_ENV=production

RUN npm install -g pnpm
RUN pnpm install

CMD ["node", "--run", "start:prod"]
