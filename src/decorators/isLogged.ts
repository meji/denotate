import {
  container,
  Content,
  Context,
  getMetadataArgsStorage,
  HookTarget
} from "../../deps.ts";
import { getQueryParams } from "../utils/index.ts";
import { verifyUser } from "../utils/verifyToken.ts";

enum BusinessType {
  Controller = "controller",
  Action = "action",
  Area = "area"
}

type AuthorizeRoleType = string | undefined;

/**
 * Authorize decorator with role
 */
export function Authorize(): Function {
  return function(object: Object, methodName?: string) {
    // add hook to global metadata
    getMetadataArgsStorage().hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName ? methodName : "",
      instance: container.resolve(AutorizeHook)
    });
  };
}

export class AutorizeHook implements HookTarget<unknown, any> {
  async onPreAction(context: Context<unknown>) {
    const queryParams = getQueryParams(context.request.url);
    if (queryParams) {
      const token = queryParams.get("token");
      if (token) {
        await verifyUser(token).then(response => {
          if (!response) {
            context.response.result = Content({ error: { token: false } }, 403);
            context.response.setImmediately();
          } else {
            context.response.result = Content({ user: response }, 200);
            context.response.setImmediately();
          }
        });
      } else {
        context.response.result = Content({ error: { token: false } }, 403);
        context.response.setImmediately();
      }
    } else {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  }
}
