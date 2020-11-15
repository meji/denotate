import { app } from "./src/app.ts";
import env from "./src/config/env.ts";
import { colors } from "./deps.ts";
import { displayDinosaur } from "./src/utils/index.ts";

console.log(colors.green(displayDinosaur(env.denoEnv === "PROD")));
await app.listen(`${env.denoHost}:${env.denoPort}`);
