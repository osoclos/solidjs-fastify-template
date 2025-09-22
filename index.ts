import os from "os";

import fastify, { type FastifyListenOptions } from "fastify";
import fastifyViteAddon from "@fastify/vite";

const server = fastify();
await server.register(fastifyViteAddon, {
    root: __dirname,
    spa: true,

    dev: process.argv.includes("--dev")
});

await server.vite.ready();

const listenOpts: FastifyListenOptions = { port: 3000 };
if (process.argv.includes("--host")) {
    const interfaces = os.networkInterfaces();

    let res: string | null = null;
    interfaceLoop: for (const name in interfaces) {
        const infos = interfaces[name]!;

        for (const { family, address, internal } of infos) {
            if (internal || family !== "IPv4") continue;

            res = address;
            break interfaceLoop;
        }
    }

    listenOpts.host = res ?? "0.0.0.0";
}

server.listen(listenOpts, () => console.log(`listening to http://${"host" in listenOpts ? listenOpts.host : "localhost"}:${listenOpts.port}/`));
server.get("/", (_, rep) => {
    console.log("retrieving HTML file from server!");
    rep.html();
});
