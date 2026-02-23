import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, "..", "..");

const sourceCondoAssets = resolve(projectRoot, "assets", "condominio");
const targetCondoAssets = resolve(projectRoot, "frontend", "assets", "condominio");

await mkdir(targetCondoAssets, { recursive: true });
await cp(sourceCondoAssets, targetCondoAssets, { recursive: true, force: true });

console.log("Assets de condominio sincronizados a frontend/assets/condominio");
