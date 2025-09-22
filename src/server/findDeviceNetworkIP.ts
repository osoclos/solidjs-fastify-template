import os from "os";

export function findDeviceNetworkIP(): string | null {
    const interfaces = os.networkInterfaces();

    for (const name in interfaces) {
        const infos = interfaces[name]!;
        for (const { family, address, internal } of infos) if (!internal && family === "IPv4") return address;
    }

    return null;
}
