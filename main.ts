import { app } from "./src/app.ts";
import env from "./src/config/env.ts";
import { displayDinosaur } from "./src/utils/index.ts";
displayDinosaur(env.denoEnv === "PROD");

await app.listen(`${env.denoHost}:${env.denoPort}`);
