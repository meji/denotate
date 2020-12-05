import { convertBearerToToken } from "./index.ts";
import { verify } from "../../deps.ts";
import env from "../config/env.ts";
import { TokenService } from "../services/token.service.ts";

export async function getUserFromToken(
  headers: Headers
): Promise<string | false> {
  const bearer = headers.get("authorization");
  if (!bearer) {
    return false;
  }
  const [token] = convertBearerToToken(bearer);
  const tokenService = new TokenService();
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
    return jwt.iss;
  } catch {
    return false;
  }
}
