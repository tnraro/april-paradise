FROM node:22-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY package.json pnpm-lock.yaml  ./
COPY patches/ patches/

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS dev-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=dev-deps /app/node_modules/ node_modules/
COPY package.json vite.config.ts svelte.config.js tsconfig.json ./
COPY src/ src/
COPY static/ static/
COPY scripts/ scripts/
RUN bun generate:api && bun generate:item-imgs && bun run build

FROM docker.io/oven/bun:1 AS install
RUN mkdir -p /temp/prod
RUN echo "Asia/Seoul" > /etc/timezone

FROM docker.io/oven/bun:1-distroless AS release
ENV NODE_ENV=production
WORKDIR /app
COPY --from=install /usr/share/zoneinfo/Asia/Seoul /etc/localtime
COPY --from=install /etc/timezone /etc/timezone
COPY --from=prod-deps /app/node_modules/ node_modules/
COPY --from=build /app/.svelte-kit/out/ .

EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "index.js"]