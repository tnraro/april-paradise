find .svelte-kit/* -type d -exec rm -rf {} +
find .svelte-kit ! -name 'tsconfig.json' -type f -exec rm -f {} +

NODE_ENV=production pnpm build

docker build --pull -t april_paradise .
