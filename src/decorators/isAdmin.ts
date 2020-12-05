import {
  Content,
  Context,
  HookTarget,
  getMetadataArgsStorage,
  container
} from "../../deps.ts";
import { getQueryParams } from "../utils";

enum BusinessType {
  Controller = "controller",
  Action = "action",
  Area = "area"
}

type AuthorizeRoleType = string | undefined;

/**
 * Authorize decorator with role
 */
export function AuthorizeAdmin(): Function {
  return function(object: any, methodName?: string) {
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

export class AutorizeHook implements HookTarget<unknown, AuthorizeRoleType> {
  onPreAction(context: Context<unknown>, role: AuthorizeRoleType) {
    const queryParams = getQueryParams(context.request.url);

    if (
      queryParams == undefined ||
      queryParams.get("role") !== "admin" ||
      queryParams.get("token").length == 0
    ) {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  }
}
