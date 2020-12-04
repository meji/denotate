import { app } from "./src/app.ts";
import env from "./src/config/env.ts";
import { displayDinosaur } from "./src/utils/index.ts";
import { parse } from "./deps.ts";
displayDinosaur(env.denoEnv === "PROD");

const { args } = Deno;
const argPort = parse(args).port;

await app.listen(`${env.denoHost}:${argPort ? Number(argPort) : env.denoPort}`);
