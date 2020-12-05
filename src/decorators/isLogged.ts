import {
  Content,
  Context,
  HookTarget,
  getMetadataArgsStorage,
  container
} from "../../deps.ts";
import { getQueryParams } from "../utils";
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
export function Authorize(token?: AuthorizeRoleType): Function {
  return function(object: any, methodName?: string) {
    // add hook to global metadata
    getMetadataArgsStorage().hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName ? methodName : "",
      instance: container.resolve(AutorizeHook),
      payload: token
    });
  };
}

export class AutorizeHook implements HookTarget<unknown, AuthorizeRoleType> {
  onPreAction(context: Context<unknown>, role: AuthorizeRoleType) {
    const queryParams = getQueryParams(context.request.url);
    const token = queryParams.get("token");
    if (token.length == 0 || !verifyUser(token)) {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  }
}
