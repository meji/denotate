import { convertBearerToToken } from "./index.ts";
import { ForbiddenError, verify, Content } from "../../deps.ts";
import env from "../config/env.ts";
import { TokenService } from "../services/token.service.ts";

export async function verifyAuth(
  headers: Headers,
  isLogout = false
): Promise<string | null> {
  const bearer = headers.get("authorization");

  if (!bearer) {
    return null;
  }

  const [token, header, payload, signature] = convertBearerToToken(bearer);
  const tokenService = new TokenService();
  const allTokens = await tokenService.findAllTokens();

  const tokens = allTokens.map(
    ({ header, payload, signature }) => `${header}.${payload}.${signature}`
  );

  if (tokens.includes(token)) {
    return null;
  }

  const jwt = await verify(token, env.secret, "HS512");

  if (!jwt || !jwt.iss || !jwt.exp || jwt.exp < new Date().getTime()) {
    return null;
  }

  if (isLogout) {
    await tokenService.insertToken({
      header,
      payload,
      signature,
      exp: jwt.exp
    });
  }
  return jwt.iss;
}
