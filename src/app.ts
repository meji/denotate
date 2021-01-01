import { App, Content, Context, HttpError, CorsBuilder } from "../deps.ts";
import { appSettings } from "./settings.ts";

export const app = new App(appSettings);

app.useCors(
  new CorsBuilder()
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
);

app.useStatic({
  root: `${Deno.cwd()}/public/`,
  baseRoute: "/"
});

app.error((context: Context<any>, error: Error) => {
  context.response.result = Content(
    "There is a 500 server error",
    (error as HttpError).httpCode || 500
  );
  context.response.setImmediately();
});
