import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  roleId: string;
}

export default class JwtService {
  static generateAccessToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.sign(payload, secret, {
      expiresIn: "15m",
    });
  }

  static verifyAccessToken(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.verify(token, secret) as JwtPayload;
  }
}