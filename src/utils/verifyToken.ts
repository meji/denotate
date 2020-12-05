import { verify } from "../../deps.ts";
import env from "../config/env.ts";
import { UserService } from "../services/user.service.ts";

export async function verifyUser(token: string) {
  const jwt = await verify(token, env.secret, "HS512");
  if (!jwt || !jwt.iss || !jwt.exp) {
    return null;
  }
  const user = jwt.iss;
  const userService = new UserService();
  try {
    const userFinded = await userService.findUserById(user);
    if (userFinded) {
      return true;
    }
  } catch (e) {
    throw e;
  }
  return false;
}
