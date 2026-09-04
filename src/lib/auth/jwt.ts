import {
  JWTPayload,
  jwtVerify,
  SignJWT,
} from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not defined."
  );
}

const secret =
  new TextEncoder().encode(
    JWT_SECRET
  );

export interface AccessTokenPayload
  extends JWTPayload {
  userId: string;
  roleId: string;
}

/*
 * =================================================
 * GENERATE ACCESS TOKEN
 * =================================================
 *
 * Remember Me OFF:
 *   JWT expires in 15 minutes
 *
 * Remember Me ON:
 *   JWT expires in 30 days
 *
 * The same lifetime is also applied to the
 * authentication cookie in the OTP verification API.
 */
export async function generateAccessToken(
  payload: AccessTokenPayload,
  rememberMe: boolean = false
): Promise<string> {
  return await new SignJWT({
    userId:
      payload.userId,

    roleId:
      payload.roleId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(
      rememberMe
        ? "30d"
        : "15m"
    )
    .sign(secret);
}

/*
 * =================================================
 * VERIFY ACCESS TOKEN
 * =================================================
 *
 * jwtVerify() validates:
 *
 * - JWT signature
 * - JWT structure
 * - JWT expiration
 */
export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload> {
  const { payload } =
    await jwtVerify(
      token,
      secret
    );

  return {
    userId:
      payload.userId as string,

    roleId:
      payload.roleId as string,
  };
}