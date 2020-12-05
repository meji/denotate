import { verify } from "../../deps.ts";
import env from "../config/env.ts";
import { UserService } from "../services/user.service.ts";

export async function verifyUser(token: string) {
  const jwt = await verify(token, env.secret, "HS512");
  if (!jwt.iss || !jwt.exp || jwt.exp < new Date().getTime()) {
    return false;
  }
  const user = jwt.iss;
  const userService = new UserService();
  try {
    return await userService.findUserById(user);
  } catch (e) {
    throw e;
  }
  return false;
}
