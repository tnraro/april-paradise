FROM docker.io/oven/bun:1 AS install
RUN mkdir -p /temp/prod
RUN echo "Asia/Seoul" > /etc/timezone

FROM docker.io/oven/bun:1-distroless AS release
WORKDIR /app
COPY --from=install /usr/share/zoneinfo/Asia/Seoul /etc/localtime
COPY --from=install /etc/timezone /etc/timezone
COPY node_modules node_modules
COPY .svelte-kit/out .

EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "index.js"]