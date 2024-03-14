import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sveltekit(),
    // @ts-expect-error it just works
    tailwindcss(),
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
