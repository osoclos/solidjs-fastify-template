import fastify, { type FastifyListenOptions } from "fastify";
import fastifyViteAddon from "@fastify/vite";

import { findDeviceNetworkIP } from "./src/server";

const server = fastify();
await server.register(fastifyViteAddon, {
    root: __dirname,
    spa: true,

    dev: process.argv.includes("--dev")
});

await server.vite.ready();

const listenOpts: FastifyListenOptions = { port: 3000 };
if (process.argv.includes("--host")) {
    const ip = findDeviceNetworkIP();

    if (ip === null) console.error("unable to find appropriate network IP to host server");
    else listenOpts.host = ip;
}

server.listen(listenOpts, () => console.log(`listening to http://${"host" in listenOpts ? listenOpts.host : "localhost"}:${listenOpts.port}/`));
server.get("/", (_, rep) => {
    console.log("retrieving HTML file from server!");
    rep.html();
});
