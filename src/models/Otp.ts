import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type OtpPurpose =
  | "LOGIN"
  | "PASSWORD_RESET";

export interface IOtp extends Document {
  userId: mongoose.Types.ObjectId;

  purpose: OtpPurpose;

  otpHash: string;

  expiresAt: Date;

  attempts: number;

  maxAttempts: number;

  isUsed: boolean;

  rememberMe: boolean;

  /*
   * Password reset token.
   *
   * IMPORTANT:
   * Only the HASH of the reset token
   * is stored in MongoDB.
   */
  resetTokenHash?: string;

  resetTokenExpiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema =
  new Schema<IOtp>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      purpose: {
        type: String,
        enum: [
          "LOGIN",
          "PASSWORD_RESET",
        ],
        required: true,
        index: true,
      },

      otpHash: {
        type: String,
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      attempts: {
        type: Number,
        default: 0,
        min: 0,
      },

      maxAttempts: {
        type: Number,
        default: 5,
      },

      isUsed: {
        type: Boolean,
        default: false,
        index: true,
      },

      /*
       * Used only for LOGIN OTP.
       *
       * PASSWORD_RESET OTP uses the
       * default false value.
       */
      rememberMe: {
        type: Boolean,
        default: false,
      },

      /*
       * Password reset token hash.
       *
       * The raw token is NEVER stored.
       */
      resetTokenHash: {
        type: String,
        default: undefined,
      },

      /*
       * Short expiry for password reset token.
       */
      resetTokenExpiresAt: {
        type: Date,
        default: undefined,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

/**
 * MongoDB automatically removes expired
 * OTP documents after expiresAt.
 */
OtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Otp: Model<IOtp> =
  mongoose.models.Otp ||
  mongoose.model<IOtp>(
    "Otp",
    OtpSchema
  );

export default Otp;