import fs from "fs";
import path from "path";

import { defineConfig, type Plugin } from "vite";

// @ts-expect-error
import fastifyPlugin from "@fastify/vite/plugin";

import solidPlugin from "vite-plugin-solid";
import tailwindcssPlugin from "@tailwindcss/vite";

const resolveImportPaths = (): Plugin => {
    function resolveId(id: string, importer: string | undefined) {
        if (id.startsWith("/.well-known/appspecific/")) return path.join(__dirname, id.slice(25)); // reroute any route requests to Chrome Devtools to the root folder
        if (!id.startsWith("~")) return null;

        const importPath = id.slice(1).replaceAll(path.sep, "/");
        let isServerFile: boolean = false;

        const importerPath = path.relative(__dirname, importer ?? __dirname).replaceAll(path.sep, "/");
        if (!importerPath.includes("/") || importerPath.startsWith("src/server/")) isServerFile = true; // any file that is in the root folder is considered a server file

        const fileRootFolder = isServerFile ? "src/server" : "src/client";

        const prefix = importPath.slice(0, importPath.indexOf("/") + 1);
        if (!prefix.endsWith("/")) return path.join(__dirname, fileRootFolder, importPath); // If the whole path is just an alias, join it with the client root folder

        let actualPath = path.join(__dirname, prefix === "shared" ? "src/shared" : fileRootFolder, importPath.slice(prefix.length));
        if (fs.statSync(actualPath).isFile()) return actualPath;

        if (!isServerFile && prefix !== "shared") {
            const tsxPath = path.join(actualPath, "index.tsx");
            if (fs.statSync(tsxPath).isFile()) return tsxPath;
        }

        actualPath = path.join(actualPath, "index.ts");
        return actualPath;
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
