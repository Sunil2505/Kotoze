import AppError from "@/core/errors/AppError";

interface SendOtpInput {
  mobile: string;
  otp: string;
}

export async function sendLoginOtp({
  mobile,
  otp,
}: SendOtpInput): Promise<void> {
  /*
   * Production:
   * This function will call the configured
   * SMS provider and send the OTP to mobile.
   *
   * IMPORTANT:
   * Never return the OTP from an API response.
   */

  const provider =
    process.env.OTP_PROVIDER ?? "console";

  if (provider === "console") {
    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      console.log(
        `[DEV OTP] ${mobile}: ${otp}`
      );

      return;
    }

    throw new AppError(
      "OTP delivery provider is not configured.",
      500
    );
  }

  throw new AppError(
    "Unsupported OTP delivery provider.",
    500
  );
}