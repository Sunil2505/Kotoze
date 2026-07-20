import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined.");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export interface AccessTokenPayload {
  userId: string;
  roleId: string;
}

export async function generateAccessToken(
  payload: AccessTokenPayload
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, secret);

  return {
    userId: payload.userId as string,
    roleId: payload.roleId as string,
  };
}