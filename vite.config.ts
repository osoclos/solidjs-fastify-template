import path from "path";

import { defineConfig, type Plugin } from "vite";

// @ts-expect-error
import fastifyPlugin from "@fastify/vite/plugin";

import solidPlugin from "vite-plugin-solid";
import tailwindcssPlugin from "@tailwindcss/vite";

const resolveImportPaths = (): Plugin => {
    function resolveId(id: string) {
        if (!id.startsWith("~")) return null;

        const importPath = id.slice(1);

        const prefix = importPath.slice(0, importPath.indexOf("/") + 1);
        if (!prefix.endsWith("/")) return path.join(__dirname, "src/client", importPath); // If the whole path is just an alias, join it with the client root folder

        return path.join(__dirname, prefix === "shared" ? "src/shared" : "src/client", importPath.slice(prefix.length));
    }

    return {
        name: "resolve-import-paths",
        resolveId
    }
};

export default defineConfig({
    root: __dirname,
    build: { outDir: path.join(__dirname, "dist") },

    plugins: [fastifyPlugin(), solidPlugin(), tailwindcssPlugin(), resolveImportPaths()]
});
