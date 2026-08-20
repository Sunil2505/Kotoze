import { NextRequest } from "next/server";

import { verifyAccessToken } from "@/lib/auth/jwt";
import AuthService from "@/services/AuthService";
import AppError from "@/core/errors/AppError";
import { IRole } from "@/models/Role";

const authService = new AuthService();

export interface AuthenticatedUser {
  roleId: IRole;
  [key: string]: any;
}

export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser> {
  const token =
    request.cookies.get(
      "kotoze_access_token"
    )?.value;

  if (!token) {
    throw new AppError(
      "Authentication required.",
      401
    );
  }

  try {
    const payload =
      await verifyAccessToken(token);

    const user =
      await authService.getCurrentUser(
        payload.userId
      );

    return user as unknown as AuthenticatedUser;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Invalid or expired authentication token.",
      401
    );
  }
}