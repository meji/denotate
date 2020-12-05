import { convertBearerToToken } from "./index.ts";
import { verify } from "../../deps.ts";
import env from "../config/env.ts";
import { TokenService } from "../services/token.service.ts";
import { UserService } from "../services/user.service.ts";
import { User, UserWithoutPass } from "../models/user.ts";

export async function getUserFromToken(
  headers: Headers,
  admin?: boolean
): Promise<UserWithoutPass | false> {
  const bearer = headers.get("authorization");
  if (!bearer) {
    return false;
  }
  const [token] = convertBearerToToken(bearer);
  const tokenService = new TokenService();
  const userService = new UserService();
  const allTokens = await tokenService.findAllTokens();
  const tokens = allTokens.map(
    ({ header, payload, signature }) => `${header}.${payload}.${signature}`
  );
  if (tokens.includes(token)) {
    return false;
  }
  try {
    const jwt = await verify(token, env.secret, "HS512");
    if (!jwt || !jwt.iss || !jwt.exp || jwt.exp < new Date().getTime()) {
      return false;
    }
    const { password, ...document } = await userService.findUserById(jwt.iss);
    if (admin && document.admin == null) {
      return false;
    }
    if (document) {
      return document;
    }
  } catch {
    return false;
  }
  return false;
}
