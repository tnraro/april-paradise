rm -r .svelte-kit/out

NODE_ENV=production pnpm build

docker build --pull -t april_paradise .

mkdir -p build
rm ./build/april_paradise.tar
docker save -o ./build/april_paradise.tar april_paradise