import bcrypt from "bcryptjs";

import UserRepository from "@/repositories/UserRepository";
import OtpService from "./OtpService";

import AppError from "@/core/errors/AppError";
import { Status } from "@/types/common";

export default class AuthService {
  private userRepository =
    new UserRepository();

  private otpService =
    new OtpService();

  /*
   * =================================================
   * LOGIN
   * =================================================
   *
   * Dashboard login accepts:
   * - Username
   * - Mobile
   * - Email
   *
   * Username is CASE-SENSITIVE.
   * Email is CASE-INSENSITIVE.
   */
  async login(
    login: string,
    password: string,
    rememberMe: boolean = false
  ) {
    const user =
      await this.userRepository.findByMobileOrEmail(
        login
      );

    if (!user || user.isDeleted) {
      throw new AppError(
        "Invalid credentials.",
        401
      );
    }

    if (
      user.status !==
      Status.ACTIVE
    ) {
      throw new AppError(
        "User account is not active.",
        403
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!isPasswordValid) {
      throw new AppError(
        "Invalid credentials.",
        401
      );
    }

    const roleCode =
      (user.roleId as any)?.code;

    /*
     * Admin and Super Admin must complete
     * OTP verification before authentication
     * is considered complete.
     */
    if (
      roleCode === "SUPER_ADMIN" ||
      roleCode === "ADMIN"
    ) {
      const otpChallenge =
        await this.otpService.createLoginOtp(
          user._id.toString(),
          user.mobile,
          Boolean(rememberMe)
        );

      /*
       * IMPORTANT:
       *
       * The raw OTP is never returned
       * to the browser.
       */
      return {
        requiresOtp: true,

        challengeId:
          otpChallenge.challengeId,

        expiresAt:
          otpChallenge.expiresAt,

        user: {
          _id:
            user._id.toString(),

          username:
            user.username,

          firstName:
            user.firstName,

          lastName:
            user.lastName,

          fullName:
            user.fullName,

          mobile:
            user.mobile,

          roleId:
            user.roleId,
        },
      };
    }

    /*
     * Non-privileged users can use the normal
     * authentication flow for now.
     */
    const updatedUser =
      await this.userRepository.updateLastLoginAt(
        user._id.toString()
      );

    if (!updatedUser) {
      throw new AppError(
        "Unable to update login information.",
        500
      );
    }

    const {
      passwordHash: _passwordHash,
      ...userResponse
    } =
      updatedUser.toObject();

    return {
      requiresOtp: false,

      rememberMe:
        Boolean(rememberMe),

      user: userResponse,
    };
  }

  /*
   * =================================================
   * REQUEST PASSWORD RESET
   * =================================================
   *
   * Password reset requires:
   *
   * 1. Exact username
   * 2. Registered mobile number OR email
   *
   * Username is CASE-SENSITIVE.
   * Email comparison is CASE-INSENSITIVE.
   *
   * OTP is always sent to the registered
   * mobile number.
   */
  async requestPasswordReset(
    username: string,
    contact: string
  ) {
    const normalizedUsername =
      username.trim();

    const normalizedContact =
      contact.trim();

    if (!normalizedUsername) {
      throw new AppError(
        "Please enter your username.",
        400
      );
    }

    if (!normalizedContact) {
      throw new AppError(
        "Please enter your registered mobile number or email.",
        400
      );
    }

    /*
     * IMPORTANT:
     *
     * Do NOT convert username to lowercase.
     *
     * Username must match the exact case stored
     * in MongoDB.
     */
    const user =
      await this.userRepository.findByUsername(
        normalizedUsername
      );

    if (!user || user.isDeleted) {
      throw new AppError(
        "Invalid username. Please enter a registered username.",
        404
      );
    }

    if (
      user.status !==
      Status.ACTIVE
    ) {
      throw new AppError(
        "User account is not active.",
        403
      );
    }

    const registeredMobile =
      user.mobile.trim();

    const registeredEmail =
      user.email
        .trim()
        .toLowerCase();

    const enteredEmail =
      normalizedContact.toLowerCase();

    const isMobileMatch =
      normalizedContact ===
      registeredMobile;

    const isEmailMatch =
      enteredEmail ===
      registeredEmail;

    if (
      !isMobileMatch &&
      !isEmailMatch
    ) {
      throw new AppError(
        "Registered mobile number or email does not match this username.",
        400
      );
    }

    if (!registeredMobile) {
      throw new AppError(
        "No mobile number is registered for this account.",
        400
      );
    }

    const otpChallenge =
      await this.otpService.createPasswordResetOtp(
        user._id.toString(),
        registeredMobile
      );

    return {
      challengeId:
        otpChallenge.challengeId,

      expiresAt:
        otpChallenge.expiresAt,
    };
  }

  /*
   * =================================================
   * RESEND PASSWORD RESET OTP
   * =================================================
   */
  async resendPasswordResetOtp(
    challengeId: string
  ) {
    return this.otpService.resendPasswordResetOtp(
      challengeId
    );
  }

  /*
   * =================================================
   * VERIFY PASSWORD RESET OTP
   * =================================================
   */
  async verifyPasswordResetOtp(
    challengeId: string,
    otp: string
  ) {
    if (!otp?.trim()) {
      throw new AppError(
        "Please enter the OTP.",
        400
      );
    }

    return this.otpService.verifyPasswordResetOtp(
      challengeId,
      otp.trim()
    );
  }

  /*
   * =================================================
   * RESET PASSWORD
   * =================================================
   *
   * IMPORTANT:
   *
   * The client must NOT send userId.
   *
   * Successful OTP verification returns a
   * short-lived resetToken. That token is used
   * to authorize the password change.
   */
  async resetPassword(
    resetToken: string,
    newPassword: string
  ) {
    if (!resetToken?.trim()) {
      throw new AppError(
        "Invalid password reset request.",
        400
      );
    }

    if (!newPassword) {
      throw new AppError(
        "New password is required.",
        400
      );
    }

    if (newPassword.length < 6) {
      throw new AppError(
        "Password must be at least 6 characters.",
        400
      );
    }

    /*
     * Validate the short-lived reset token.
     *
     * This also gives us the userId without
     * exposing it to the browser.
     */
    const resetSession =
      await this.otpService.verifyPasswordResetToken(
        resetToken.trim()
      );

    const userId =
      resetSession.userId;

    const user =
      await this.userRepository.findById(
        userId
      );

    if (!user || user.isDeleted) {
      throw new AppError(
        "Invalid password reset request.",
        400
      );
    }

    if (
      user.status !==
      Status.ACTIVE
    ) {
      throw new AppError(
        "User account is not active.",
        403
      );
    }

    /*
     * Hash the new password before storing.
     */
    const passwordHash =
      await bcrypt.hash(
        newPassword,
        12
      );

    const updatedUser =
      await this.userRepository.updatePassword(
        userId,
        passwordHash
      );

    if (!updatedUser) {
      throw new AppError(
        "Unable to reset password.",
        500
      );
    }

    /*
     * Password reset token is single-use.
     */
    await this.otpService.consumePasswordResetToken(
      resetToken.trim()
    );

    return {
      success: true,
    };
  }

  /*
   * =================================================
   * CURRENT USER
   * =================================================
   */
  async getCurrentUser(
    userId: string
  ) {
    const user =
      await this.userRepository.findByIdWithRole(
        userId
      );

    if (
      !user ||
      user.isDeleted
    ) {
      throw new AppError(
        "User not found.",
        404
      );
    }

    if (
      user.status !==
      Status.ACTIVE
    ) {
      throw new AppError(
        "User account is not active.",
        403
      );
    }

    return user;
  }
}