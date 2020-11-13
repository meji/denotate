import { Application, Router } from "../deps.ts";
import { indexRouter } from "./routes/index.ts";

export const app = new Application();
const router = new Router();

router.get("/", indexRouter);

app.use(router.routes());
app.use(router.allowedMethods());
