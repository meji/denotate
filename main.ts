import { app } from "./src/app.ts";
import env from "./src/config/env.ts";
import { displayDinosaur } from "./src/utils/index.ts";
import { flags } from "./deps.ts";
displayDinosaur(env.denoEnv === "PROD");

const { args, exit } = Deno;

const DEFAULT_PORT = env.denoPort;
const argPort = flags.parse(args).port;
const port = argPort ? Number(argPort) : Number(DEFAULT_PORT);
if (isNaN(port)) {
  console.log("This is not port number");
  exit(1);
}
await app.listen({ port: port });
