FROM docker.io/oven/bun:1 AS install
RUN mkdir -p /temp/prod
COPY package.json /temp/prod
RUN cd /temp/prod && bun install --production

FROM docker.io/oven/bun:1 AS release
WORKDIR /app
COPY --from=install /temp/prod/node_modules node_modules
COPY .svelte-kit .

USER bun
EXPOSE 4173/tcp
ENTRYPOINT ["bun", "-b", "run", "vite", "preview"]