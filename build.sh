git pull

edgedb migrate || exit 1

rm -r .svelte-kit/out

pnpm install || exit 1

pnpm generate:api || exit 1
pnpm generate:edgeql || exit 1

NODE_ENV=production pnpm build || exit 1

docker compose build || exit 1

docker compose restart
