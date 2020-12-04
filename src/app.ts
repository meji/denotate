import { App, Content, Context, HttpError } from "../deps.ts";
import { appSettings } from "./settings.ts";

export const app = new App(appSettings);

app.error((context: Context<any>, error: Error) => {
  context.response.result = Content(
    "This page unprocessed error",
    (error as HttpError).httpCode || 500
  );
  context.response.setImmediately();
});
