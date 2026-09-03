import crypto from "crypto";
import mongoose from "mongoose";

import Otp, {
  IOtp,
  OtpPurpose,
} from "@/models/Otp";

import UserRepository from "@/repositories/UserRepository";
import { sendLoginOtp } from "@/lib/auth/otpDelivery";

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const RESET_TOKEN_EXPIRY_MINUTES = 10;

/*
 * TEMPORARY DEVELOPMENT OTP
 *
 * This is ONLY for local development/testing.
 * It is NEVER accepted when NODE_ENV=production.
 *
 * Later, when MSG91 is connected, remove this
 * and use the real generated OTP.
 */
const DEV_DUMMY_OTP = "123456";

export default class OtpService {
  private userRepository =
    new UserRepository();

  /*
   * =================================================
   * GENERATE SECURE OTP
   * =================================================
   */
  private generateOtp(): string {
    return crypto
      .randomInt(100000, 1000000)
      .toString();
  }

  /*
   * =================================================
   * HASH OTP
   * =================================================
   */
  private hashOtp(
    otp: string,
    challengeId: string
  ): string {
    return crypto
      .createHash("sha256")
      .update(
        `${challengeId}:${otp}`
      )
      .digest("hex");
  }

  /*
   * =================================================
   * HASH RESET TOKEN
   * =================================================
   */
  private hashResetToken(
    resetToken: string
  ): string {
    return crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  }

  /*
   * =================================================
   * GET OTP
   * =================================================
   *
   * LOCAL DEVELOPMENT:
   *   123456
   *
   * PRODUCTION:
   *   Secure random OTP
   */
  private getLoginOtp(): string {
    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      return DEV_DUMMY_OTP;
    }

    return this.generateOtp();
  }

  /*
   * =================================================
   * CREATE LOGIN OTP
   * =================================================
   */
  async createLoginOtp(
    userId: string,
    mobile: string,
    rememberMe: boolean = false
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new Error(
        "Invalid user ID."
      );
    }

    if (!mobile?.trim()) {
      throw new Error(
        "Mobile number is required for OTP delivery."
      );
    }

    /*
     * Invalidate previous unused
     * LOGIN OTP challenges.
     */
    await Otp.updateMany(
      {
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),

        purpose: "LOGIN",

        isUsed: false,
      },
      {
        $set: {
          isUsed: true,
        },
      }
    );

    const otp =
      this.getLoginOtp();

    const expiresAt =
      new Date(
        Date.now() +
          OTP_EXPIRY_MINUTES *
            60 *
            1000
      );

    const otpDocument =
      new Otp({
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),

        purpose:
          "LOGIN" as OtpPurpose,

        otpHash: "pending",

        expiresAt,

        attempts: 0,

        maxAttempts:
          MAX_OTP_ATTEMPTS,

        isUsed: false,

        rememberMe:
          Boolean(rememberMe),
      });

    /*
     * Store only OTP hash.
     */
    otpDocument.otpHash =
      this.hashOtp(
        otp,
        otpDocument._id.toString()
      );

    await otpDocument.save();

    try {
      await sendLoginOtp({
        mobile: mobile.trim(),
        otp,
      });
    } catch (error) {
      await Otp.updateOne(
        {
          _id: otpDocument._id,
        },
        {
          $set: {
            isUsed: true,
          },
        }
      );

      throw error;
    }

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.log(
        `[DEV LOGIN OTP] ${otp}`
      );
    }

    return {
      challengeId:
        otpDocument._id.toString(),

      expiresAt,
    };
  }

  /*
   * =================================================
   * RESEND LOGIN OTP
   * =================================================
   */
  async resendLoginOtp(
    challengeId: string
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(
        challengeId
      )
    ) {
      throw new Error(
        "Invalid OTP challenge."
      );
    }

    const previousChallenge =
      await Otp.findOne({
        _id: challengeId,

        purpose: "LOGIN",
      });

    if (!previousChallenge) {
      throw new Error(
        "OTP challenge not found."
      );
    }

    const user =
      await this.userRepository.findById(
        previousChallenge.userId.toString()
      );

    if (!user || user.isDeleted) {
      throw new Error(
        "User not found."
      );
    }

    if (!user.mobile) {
      throw new Error(
        "No mobile number is registered for this account."
      );
    }

    return this.createLoginOtp(
      user._id.toString(),
      user.mobile,
      previousChallenge.rememberMe
    );
  }

  /*
   * =================================================
   * VERIFY LOGIN OTP
   * =================================================
   */
  async verifyOtp(
    challengeId: string,
    otp: string
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(
        challengeId
      )
    ) {
      throw new Error(
        "Invalid OTP challenge."
      );
    }

    const otpDocument =
      await Otp.findOne({
        _id: challengeId,

        purpose: "LOGIN",

        isUsed: false,
      });

    if (!otpDocument) {
      throw new Error(
        "OTP is invalid or has already been used."
      );
    }

    if (
      otpDocument.expiresAt.getTime() <=
      Date.now()
    ) {
      await Otp.updateOne(
        {
          _id: otpDocument._id,
        },
        {
          $set: {
            isUsed: true,
          },
        }
      );

      throw new Error(
        "OTP has expired."
      );
    }

    if (
      otpDocument.attempts >=
      otpDocument.maxAttempts
    ) {
      await Otp.updateOne(
        {
          _id: otpDocument._id,
        },
        {
          $set: {
            isUsed: true,
          },
        }
      );

      throw new Error(
        "Maximum OTP attempts exceeded."
      );
    }

    if (
      !/^\d{6}$/.test(otp)
    ) {
      otpDocument.attempts += 1;

      if (
        otpDocument.attempts >=
        otpDocument.maxAttempts
      ) {
        otpDocument.isUsed = true;
      }

      await otpDocument.save();

      throw new Error(
        "Invalid OTP."
      );
    }

    /*
     * TEMPORARY DEVELOPMENT DUMMY OTP
     */
    if (
      process.env.NODE_ENV !==
        "production" &&
      otp === DEV_DUMMY_OTP
    ) {
      console.log(
        "[DEV OTP] Dummy OTP verified successfully."
      );

      otpDocument.isUsed = true;

      await otpDocument.save();

      return {
        userId:
          otpDocument.userId.toString(),

        rememberMe:
          otpDocument.rememberMe,
      };
    }

    /*
     * NORMAL SECURE OTP VERIFICATION
     */
    const submittedHash =
      this.hashOtp(
        otp,
        otpDocument._id.toString()
      );

    const storedHash =
      otpDocument.otpHash;

    if (
      submittedHash.length !==
        storedHash.length ||
      !/^[a-f0-9]+$/i.test(
        storedHash
      )
    ) {
      otpDocument.attempts += 1;

      if (
        otpDocument.attempts >=
        otpDocument.maxAttempts
      ) {
        otpDocument.isUsed = true;
      }

      await otpDocument.save();

      throw new Error(
        "Invalid OTP."
      );
    }

    const isValid =
      crypto.timingSafeEqual(
        Buffer.from(
          submittedHash,
          "hex"
        ),
        Buffer.from(
          storedHash,
          "hex"
        )
      );

    if (!isValid) {
      otpDocument.attempts += 1;

      if (
        otpDocument.attempts >=
        otpDocument.maxAttempts
      ) {
        otpDocument.isUsed = true;
      }

      await otpDocument.save();

      throw new Error(
        "Invalid OTP."
      );
    }

    otpDocument.isUsed = true;

    await otpDocument.save();

    return {
      userId:
        otpDocument.userId.toString(),

      rememberMe:
        otpDocument.rememberMe,
    };
  }

  /*
   * =================================================
   * CREATE PASSWORD RESET OTP
   * =================================================
   */
  async createPasswordResetOtp(
    userId: string,
    mobile: string
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new Error(
        "Invalid user ID."
      );
    }

    if (!mobile?.trim()) {
      throw new Error(
        "Mobile number is required for OTP delivery."
      );
    }

    /*
     * Invalidate previous unused
     * PASSWORD_RESET challenges.
     *
     * LOGIN challenges are untouched.
     */
    await Otp.updateMany(
      {
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),

        purpose:
          "PASSWORD_RESET",

        isUsed: false,
      },
      {
        $set: {
          isUsed: true,
        },
      }
    );

    const otp =
      this.getLoginOtp();

    const expiresAt =
      new Date(
        Date.now() +
          OTP_EXPIRY_MINUTES *
            60 *
            1000
      );

    const otpDocument =
      new Otp({
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),

        purpose:
          "PASSWORD_RESET" as OtpPurpose,

        otpHash: "pending",

        expiresAt,

        attempts: 0,

        maxAttempts:
          MAX_OTP_ATTEMPTS,

        isUsed: false,

        rememberMe: false,

        resetTokenHash:
          undefined,

        resetTokenExpiresAt:
          undefined,
      });

    otpDocument.otpHash =
      this.hashOtp(
        otp,
        otpDocument._id.toString()
      );

    await otpDocument.save();

    try {
      await sendLoginOtp({
        mobile: mobile.trim(),
        otp,
      });
    } catch (error) {
      await Otp.updateOne(
        {
          _id: otpDocument._id,
        },
        {
          $set: {
            isUsed: true,
          },
        }
      );

      throw error;
    }

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.log(
        `[DEV PASSWORD RESET OTP] ${otp}`
      );
    }

    return {
      challengeId:
        otpDocument._id.toString(),

      expiresAt,
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
    if (
      !mongoose.Types.ObjectId.isValid(
        challengeId
      )
    ) {
      throw new Error(
        "Invalid OTP challenge."
      );
    }

    const previousChallenge =
      await Otp.findOne({
        _id: challengeId,

        purpose:
          "PASSWORD_RESET",
      });

    if (!previousChallenge) {
      throw new Error(
        "OTP challenge not found."
      );
    }

    if (
      previousChallenge.isUsed
    ) {
      throw new Error(
        "OTP challenge has already been used."
      );
    }

    const user =
      await this.userRepository.findById(
        previousChallenge.userId.toString()
      );

    if (!user || user.isDeleted) {
      throw new Error(
        "User not found."
      );
    }

    if (!user.mobile) {
      throw new Error(
        "No mobile number is registered for this account."
      );
    }

    return this.createPasswordResetOtp(
      user._id.toString(),
      user.mobile
    );
  }

  /*
   * =================================================
   * VERIFY PASSWORD RESET OTP
   * =================================================
   *
   * On successful verification:
   *
   * 1. OTP is consumed.
   * 2. Secure random reset token is generated.
   * 3. Only the token hash is stored.
   * 4. Raw token is returned to the API layer.
   */
  async verifyPasswordResetOtp(
    challengeId: string,
    otp: string
  ) {
    if (
      !mongoose.Types.ObjectId.isValid(
        challengeId
      )
    ) {
      throw new Error(
        "Invalid OTP challenge."
      );
    }

    const otpDocument =
      await Otp.findOne({
        _id: challengeId,

        purpose:
          "PASSWORD_RESET",

        isUsed: false,
      });

    if (!otpDocument) {
      throw new Error(
        "OTP is invalid or has already been used."
      );
    }

    if (
      otpDocument.expiresAt.getTime() <=
      Date.now()
    ) {
      otpDocument.isUsed = true;

      await otpDocument.save();

      throw new Error(
        "OTP has expired."
      );
    }

    if (
      otpDocument.attempts >=
      otpDocument.maxAttempts
    ) {
      otpDocument.isUsed = true;

      await otpDocument.save();

      throw new Error(
        "Maximum OTP attempts exceeded."
      );
    }

    if (
      !/^\d{6}$/.test(otp)
    ) {
      otpDocument.attempts += 1;

      if (
        otpDocument.attempts >=
        otpDocument.maxAttempts
      ) {
        otpDocument.isUsed = true;
      }

      await otpDocument.save();

      throw new Error(
        "Invalid OTP."
      );
    }

    /*
     * TEMPORARY DEVELOPMENT DUMMY OTP
     */
    if (
      process.env.NODE_ENV !==
        "production" &&
      otp === DEV_DUMMY_OTP
    ) {
      console.log(
        "[DEV OTP] Password reset OTP verified successfully."
      );

      return this.completePasswordResetOtpVerification(
        otpDocument
      );
    }

    /*
     * NORMAL SECURE OTP VERIFICATION
     */
    const submittedHash =
      this.hashOtp(
        otp,
        otpDocument._id.toString()
      );

    const storedHash =
      otpDocument.otpHash;

    if (
      submittedHash.length !==
        storedHash.length ||
      !/^[a-f0-9]+$/i.test(
        storedHash
      )
    ) {
      otpDocument.attempts += 1;

      if (
        otpDocument.attempts >=
        otpDocument.maxAttempts
      ) {
        otpDocument.isUsed = true;
      }

      await otpDocument.save();

      throw new Error(
        "Invalid OTP."
      );
    }

    const isValid =
      crypto.timingSafeEqual(
        Buffer.from(
          submittedHash,
          "hex"
        ),
        Buffer.from(
          storedHash,
          "hex"
        )
      );

    if (!isValid) {
      otpDocument.attempts += 1;

      if (
        otpDocument.attempts >=
        otpDocument.maxAttempts
      ) {
        otpDocument.isUsed = true;
      }

      await otpDocument.save();

      throw new Error(
        "Invalid OTP."
      );
    }

    return this.completePasswordResetOtpVerification(
      otpDocument
    );
  }

  /*
   * =================================================
   * COMPLETE PASSWORD RESET OTP VERIFICATION
   * =================================================
   *
   * Creates a one-time reset token and stores
   * only its hash in MongoDB.
   */
  private async completePasswordResetOtpVerification(
    otpDocument: mongoose.HydratedDocument<IOtp>
  ) {
    /*
     * Consume OTP immediately.
     */
    otpDocument.isUsed = true;

    /*
     * Generate a cryptographically secure
     * random reset token.
     */
    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    /*
     * Store only the hash.
     */
    otpDocument.resetTokenHash =
      this.hashResetToken(
        resetToken
      );

    /*
     * Reset token remains valid for
     * 10 minutes.
     */
    otpDocument.resetTokenExpiresAt =
      new Date(
        Date.now() +
          RESET_TOKEN_EXPIRY_MINUTES *
            60 *
            1000
      );

    await otpDocument.save();

    return {
      resetToken,
    };
  }

  /*
   * =================================================
   * VERIFY PASSWORD RESET TOKEN
   * =================================================
   *
   * Returns the user ID only after the token
   * has been cryptographically verified.
   */
  async verifyPasswordResetToken(
    resetToken: string
  ) {
    if (
      !resetToken?.trim()
    ) {
      throw new Error(
        "Invalid password reset token."
      );
    }

    const tokenHash =
      this.hashResetToken(
        resetToken.trim()
      );

    const otpDocument =
      await Otp.findOne({
        purpose:
          "PASSWORD_RESET",

        resetTokenHash:
          tokenHash,

        isUsed: true,
      });

    if (!otpDocument) {
      throw new Error(
        "Invalid or expired password reset token."
      );
    }

    if (
      !otpDocument.resetTokenExpiresAt ||
      otpDocument.resetTokenExpiresAt.getTime() <=
        Date.now()
    ) {
      throw new Error(
        "Password reset token has expired."
      );
    }

    return {
      userId:
        otpDocument.userId.toString(),
    };
  }

  /*
   * =================================================
   * CONSUME PASSWORD RESET TOKEN
   * =================================================
   *
   * Called after the password has been changed.
   */
  async consumePasswordResetToken(
    resetToken: string
  ) {
    if (
      !resetToken?.trim()
    ) {
      throw new Error(
        "Invalid password reset token."
      );
    }

    const tokenHash =
      this.hashResetToken(
        resetToken.trim()
      );

    const otpDocument =
      await Otp.findOne({
        purpose:
          "PASSWORD_RESET",

        resetTokenHash:
          tokenHash,

        isUsed: true,
      });

    if (!otpDocument) {
      throw new Error(
        "Invalid password reset token."
      );
    }

    if (
      !otpDocument.resetTokenExpiresAt ||
      otpDocument.resetTokenExpiresAt.getTime() <=
        Date.now()
    ) {
      throw new Error(
        "Password reset token has expired."
      );
    }

    /*
     * Remove token so it can never
     * be used again.
     */
    otpDocument.resetTokenHash =
      undefined;

    otpDocument.resetTokenExpiresAt =
      undefined;

    await otpDocument.save();
  }
}