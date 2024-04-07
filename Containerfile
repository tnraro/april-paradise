FROM docker.io/oven/bun:1 AS install
RUN mkdir -p /temp/prod
COPY package.json /temp/prod
RUN cd /temp/prod && bun install

FROM docker.io/oven/bun:1-distroless AS release
WORKDIR /app
COPY --from=install /temp/prod/node_modules node_modules
COPY .svelte-kit/out .

EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "index.js"]