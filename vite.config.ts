import path from "path";
import { defineConfig } from "vite";

// @ts-expect-error
import fastifyPlugin from "@fastify/vite/plugin";

import solidPlugin from "vite-plugin-solid";
import tailwindcssPlugin from "@tailwindcss/vite";

export default defineConfig({
    root: __dirname,
    build: { outDir: path.join(__dirname, "dist") },

    plugins: [fastifyPlugin(), solidPlugin(), tailwindcssPlugin()]
});
