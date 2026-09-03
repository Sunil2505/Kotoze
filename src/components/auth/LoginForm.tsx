"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import PasswordInput from "./PasswordInput";

const OTP_DURATION_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90";

type NotificationType = "error" | "success" | "info";

interface NotificationState {
  type: NotificationType;
  message: string;
}

export default function LoginForm() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [rememberedLogins, setRememberedLogins] =
    useState<string[]>([]);

  const [showLoginSuggestions, setShowLoginSuggestions] =
    useState(false);

  const [loading, setLoading] = useState(false);

  type AuthMode =
    | "login"
    | "login-otp"
    | "forgot"
    | "forgot-otp"
    | "reset-password"
    | "reset-success";

  const [authMode, setAuthMode] =
    useState<AuthMode>("login");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [forgotLogin, setForgotLogin] = useState("");
  const [forgotLoginError, setForgotLoginError] = useState("");
  const [forgotLoginValid, setForgotLoginValid] = useState(false);
  const forgotLoginInputRef = useRef<HTMLInputElement | null>(null);
  const [forgotContact, setForgotContact] = useState("");
  const forgotContactInputRef = useRef<HTMLInputElement | null>(null);
  const [otpDeliveryMessage, setOtpDeliveryMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0);
  const [resendSecondsLeft, setResendSecondsLeft] =
    useState(0);

  const [notification, setNotification] =
    useState<NotificationState | null>(null);

  /*
   * LOAD REMEMBERED LOGIN
   *
   * Only the login identifier is stored.
   * Password is NEVER stored.
   */
  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          "kotoze_remembered_logins"
        );

      if (!stored) {
        return;
      }

      const parsed =
        JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setRememberedLogins(
          parsed.filter(
            (item): item is string =>
              typeof item === "string" &&
              item.trim().length > 0
          )
        );
      }
    } catch (error) {
      console.error(
        "Unable to load remembered login:",
        error
      );
    }
  }, []);

  /*
   * SHOW NOTIFICATION
   */
  function showNotification(
    message: string,
    type: NotificationType = "error"
  ) {
    setNotification({
      message,
      type,
    });
  }


  /*
   * OTP COUNTDOWN
   */
  useEffect(() => {
    if ((authMode !== "login-otp" && authMode !== "forgot-otp") || otpSecondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setOtpSecondsLeft((current) =>
        Math.max(current - 1, 0)
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [authMode, otpSecondsLeft]);

  /*
   * RESEND COUNTDOWN
   */
  useEffect(() => {
    if (resendSecondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendSecondsLeft((current) =>
        Math.max(current - 1, 0)
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSecondsLeft]);

  /*
   * AUTO-FOCUS FIRST RESET OTP BOX
   *
   * This hook belongs to LoginForm itself so the hook order never changes
   * when authMode switches between login/forgot/OTP/reset screens.
   */
  useEffect(() => {
    if (authMode !== "forgot-otp") {
      return;
    }

    const timer = window.setTimeout(() => {
      const firstInput = document.getElementById(
        "reset-otp-0"
      ) as HTMLInputElement | null;

      firstInput?.focus();
      firstInput?.select();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [authMode]);

  /*
   * FORMAT TIME
   */
  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  /*
   * SAVE REMEMBERED LOGIN
   *
   * Stores only the username/mobile/email.
   * Password is never stored.
   */
  function saveRememberedLogin(
    value: string
  ) {
    const normalized =
      value.trim();

    if (!normalized) {
      return;
    }

    try {
      const existing =
        rememberedLogins.filter(
          (item) =>
            item.toLowerCase() !==
            normalized.toLowerCase()
        );

      const updated = [
        normalized,
        ...existing,
      ].slice(0, 5);

      window.localStorage.setItem(
        "kotoze_remembered_logins",
        JSON.stringify(updated)
      );

      setRememberedLogins(updated);
    } catch (error) {
      console.error(
        "Unable to save remembered login:",
        error
      );
    }
  }

  /*
   * FILTER REMEMBERED LOGINS
   *
   * Suggestions are shown while typing.
   * Matching is case-insensitive.
   */
  const filteredRememberedLogins =
    rememberedLogins.filter((savedLogin) => {
      const search =
        login.trim().toLowerCase();

      if (!search) {
        return true;
      }

      return savedLogin
        .toLowerCase()
        .includes(search);
    });

  /*
   * SELECT REMEMBERED LOGIN
   */
  function selectRememberedLogin(
    value: string
  ) {
    setLogin(value);
    setShowLoginSuggestions(false);
  }

  /*
   * MASK PASSWORD RESET CONTACT
   *
   * Examples:
   * 9876543789 -> ******789
   * sunilkr@gmail.com -> su***kr@***.com
   */
  function maskResetContact(value: string) {
    const normalized = value.trim();

    if (!normalized) {
      return "";
    }

    if (normalized.includes("@")) {
      const [localPart, domainPart = ""] = normalized.split("@");
      const domainParts = domainPart.split(".");
      const extension = domainParts.length > 1
        ? `.${domainParts.at(-1)}`
        : "";

      const maskedLocal = localPart.length <= 2
        ? `${localPart.charAt(0)}***`
        : `${localPart.slice(0, 2)}***${localPart.slice(-2)}`;

      return `${maskedLocal}@***${extension}`;
    }

    const digits = normalized.replace(/\D/g, "");

    if (digits.length >= 3) {
      return `${"*".repeat(Math.max(digits.length - 3, 3))}${digits.slice(-3)}`;
    }

    return "***";
  }

  /*
   * =================================================
   * VALIDATE PASSWORD RESET ACCOUNT
   *
   * Validation is deliberately done in two steps:
   * 1. Check whether the username exists.
   * 2. If the username exists, check whether the supplied
   *    mobile number / email belongs to that username.
   *
   * This lets us show the correct error instead of treating
   * every failure as an invalid username.
   * =================================================
   */
  function validateForgotContactFormat(contact: string): string {
    const value = contact.trim();

    if (!value) {
      return "Please enter your registered mobile number or email.";
    }

    // If the value contains only digits, it must be a valid 10-digit
    // Indian mobile number. This also prevents very long numeric values.
    if (/^\d+$/.test(value)) {
      if (!/^[6-9]\d{9}$/.test(value)) {
        return "Please enter a valid 10-digit mobile number.";
      }
      return "";
    }

    // Otherwise treat it as an email address.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address.";
    }

    return "";
  }

  async function validateForgotUsername(
    username: string,
    focusOnError = true,
    showToast = true
  ): Promise<boolean> {
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
      setForgotLoginValid(false);
      setForgotLoginError("Please enter your username.");

      if (showToast) {
        showNotification("Please enter your username.", "error");
      }

      if (focusOnError) {
        forgotLoginInputRef.current?.focus();
      }

      return false;
    }

    try {
      const response = await fetch(
        "/api/auth/check-password-reset-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login: normalizedUsername,
          }),
        }
      );

      const data = await response.json();

      if (data.valid !== true) {
        setForgotLoginValid(false);
        setForgotLoginError(
          "Invalid username. Please enter a registered username."
        );

        if (showToast) {
          showNotification(
            "Invalid username. Please enter a registered username.",
            "error"
          );
        }

        if (focusOnError) {
          forgotLoginInputRef.current?.focus();
        }

        return false;
      }

      setForgotLoginValid(true);
      setForgotLoginError("");
      return true;
    } catch (error) {
      console.error(
        "Password reset username validation failed:",
        error
      );

      setForgotLoginValid(false);
      setForgotLoginError(
        "Unable to validate the username. Please try again."
      );

      if (showToast) {
        showNotification(
          "Unable to validate the username. Please try again.",
          "error"
        );
      }

      return false;
    }
  }

  async function validateForgotAccount(
    username: string,
    contact: string,
    focusOnError = true,
    showToast = true
  ): Promise<boolean> {
    const normalizedUsername = username.trim();
    const normalizedContact = contact.trim();

    if (!normalizedUsername) {
      setForgotLoginValid(false);
      setForgotLoginError("Please enter your username.");
      if (showToast) {
        showNotification("Please enter your username.", "error");
      }
      if (focusOnError) {
        forgotLoginInputRef.current?.focus();
      }
      return false;
    }

    if (!normalizedContact) {
      setForgotLoginValid(false);
      setForgotLoginError(
        "Please enter your registered mobile number or email."
      );
      if (showToast) {
        showNotification(
          "Please enter your registered mobile number or email.",
          "error"
        );
      }
      if (focusOnError) {
        forgotContactInputRef.current?.focus();
      }
      return false;
    }

    const contactFormatError = validateForgotContactFormat(normalizedContact);

    if (contactFormatError) {
      setForgotLoginValid(false);
      setForgotLoginError(contactFormatError);

      if (showToast) {
        showNotification(contactFormatError, "error");
      }

      if (focusOnError) {
        forgotContactInputRef.current?.focus();
      }

      return false;
    }

    try {
      // STEP 1: validate username only.
      const usernameResponse = await fetch(
        "/api/auth/check-password-reset-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login: normalizedUsername,
          }),
        }
      );

      const usernameData = await usernameResponse.json();

      if (usernameData.valid !== true) {
        setForgotLoginValid(false);
        setForgotLoginError(
          "Invalid username. Please enter a registered username."
        );

        if (showToast) {
          showNotification(
            "Invalid username. Please enter a registered username.",
            "error"
          );
        }

        if (focusOnError) {
          forgotLoginInputRef.current?.focus();
        }

        return false;
      }

      // STEP 2: username exists, now validate the supplied contact.
      const contactResponse = await fetch(
        "/api/auth/check-password-reset-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login: normalizedUsername,
            contact: normalizedContact,
          }),
        }
      );

      const contactData = await contactResponse.json();

      if (contactData.valid !== true) {
        setForgotLoginValid(false);
        setForgotLoginError(
          "Registered mobile number or email does not match this username."
        );

        if (showToast) {
          showNotification(
            "Registered mobile number or email does not match this username.",
            "error"
          );
        }

        if (focusOnError) {
          forgotContactInputRef.current?.focus();
        }

        return false;
      }

      setForgotLoginValid(true);
      setForgotLoginError("");
      return true;
    } catch (error) {
      console.error(
        "Password reset account validation failed:",
        error
      );

      setForgotLoginValid(false);
      setForgotLoginError(
        "Unable to validate the username and registered contact. Please try again."
      );

      if (showToast) {
        showNotification(
          "Unable to validate the username and registered contact. Please try again.",
          "error"
        );
      }

      return false;
    }
  }

  useEffect(() => {
    if (authMode !== "forgot") return;

    const username = forgotLogin.trim();
    const contact = forgotContact.trim();

    if (!username && !contact) {
      setForgotLoginValid(false);
      setForgotLoginError("");
      return;
    }

    // Do not validate a partially typed contact. Username is checked
    // as soon as both fields have content so the user gets a specific
    // username/contact mismatch message.
    if (!username || !contact) {
      setForgotLoginValid(false);
      return;
    }

    setForgotLoginValid(false);
    setForgotLoginError("");

    const timer = window.setTimeout(() => {
      void validateForgotAccount(username, contact, false, false);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [authMode, forgotLogin, forgotContact]);

  /*
   * VALIDATE LOGIN USERNAME
   *
   * Dashboard login uses username only.
   * This validation is also used when the user presses Enter
   * in the username field.
   */
  async function validateLoginUsername(): Promise<boolean> {
    const username = login.trim();

    setLoginError("");
    setPasswordError("");

    if (!username) {
      setLoginError("Please enter your username.");
      return false;
    }

    setLoading(true);

    try {
      const accountCheckResponse = await fetch(
        "/api/auth/check-password-reset-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: username,
          }),
        }
      );

      const accountCheckData =
        await accountCheckResponse.json();

      if (accountCheckData.valid !== true) {
        setLoginError(
          "Invalid username. Please enter a registered username."
        );

        window.setTimeout(() => {
          document
            .querySelector<HTMLInputElement>(
              'input[autocomplete="username"]'
            )
            ?.focus();
        }, 0);

        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Username validation failed:",
        error
      );

      setLoginError(
        "Unable to validate the username. Please try again."
      );

      return false;
    } finally {
      setLoading(false);
    }
  }

  /*
   * LOGIN
   */
  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setNotification(null);

    const usernameValid = await validateLoginUsername();

    if (!usernameValid) {
      return;
    }

    if (!password) {
      /*
       * Password is intentionally validated only after the
       * username has been confirmed.
       */
      setPasswordError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      console.log("Login Status:", response.status);
      console.log("Login Response:", data);

      if (!response.ok) {
        setPasswordError(
          data.message ?? "Invalid password."
        );
        return;
      }

      if (data.requiresOtp) {
        setChallengeId(data.challengeId);
        setOtp("");
        setOtpError(false);
        setAuthMode("login-otp");
        setOtpSecondsLeft(OTP_DURATION_SECONDS);
        setResendSecondsLeft(
          RESEND_COOLDOWN_SECONDS
        );

        showNotification(
          "OTP has been sent to your registered mobile number.",
          "success"
        );

        return;
      }

      if (rememberMe) {
        saveRememberedLogin(
          login.trim()
        );
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      setPasswordError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * VERIFY OTP
   */
  async function handleVerifyOtp(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (otpSecondsLeft <= 0) {
      showNotification(
        "OTP has expired. Please resend a new OTP.",
        "error"
      );
      return;
    }

    if (otp.length !== 6) {
      showNotification(
        "Please enter the 6-digit OTP.",
        "error"
      );
      return;
    }

    setNotification(null);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/verify-otp",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challengeId,
            otp,
          }),
        }
      );

      const data = await response.json();

      console.log("OTP Status:", response.status);
      console.log("OTP Response:", data);

      if (!response.ok) {
        setOtpError(true);

        showNotification(
          data.message ??
            "OTP verification failed.",
          "error"
        );
        return;
      }

      if (rememberMe) {
        saveRememberedLogin(
          login.trim()
        );
      }

      showNotification(
        "OTP verified successfully.",
        "success"
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(
        "OTP verification failed:",
        error
      );

      setOtpError(true);

      showNotification(
        "Unable to verify OTP. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * RESEND OTP
   */
  async function handleResendOtp() {
    if (
      !challengeId ||
      resendSecondsLeft > 0 ||
      loading
    ) {
      return;
    }

    setNotification(null);
    setLoading(true);

    try {
      const endpoint =
        authMode === "forgot-otp"
          ? "/api/auth/resend-password-reset-otp"
          : "/api/auth/resend-otp";

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challengeId,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Resend OTP Status:",
        response.status
      );

      console.log(
        "Resend OTP Response:",
        data
      );

      if (!response.ok) {
        showNotification(
          data.message ??
            "Unable to resend OTP.",
          "error"
        );
        return;
      }

      setChallengeId(data.challengeId);
      setOtp("");
      setOtpError(false);
      setOtpSecondsLeft(OTP_DURATION_SECONDS);
      setResendSecondsLeft(
        RESEND_COOLDOWN_SECONDS
      );

      showNotification(
        "A new OTP has been sent.",
        "success"
      );
    } catch (error) {
      console.error(
        "Resend OTP failed:",
        error
      );

      showNotification(
        "Unable to resend OTP. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * FORGOT PASSWORD
   */
  function handleForgotPassword() {
    setAuthMode("forgot");
    setForgotLogin(login.trim());
    setForgotLoginError("");
    setForgotLoginValid(false);
    setForgotContact("");
    setOtpDeliveryMessage("");
    setOtp("");
    setChallengeId("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpSecondsLeft(0);
    setResendSecondsLeft(0);
    setNotification(null);
  }

  /*
   * REQUEST PASSWORD RESET
   */
  async function handleRequestPasswordReset(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const accountIsValid = await validateForgotAccount(
      forgotLogin,
      forgotContact,
      true,
      true
    );

    if (!accountIsValid) {
      return;
    }

    setNotification(null);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: forgotLogin.trim(),
            contact: forgotContact.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showNotification(
          data.message ??
            "Unable to process password reset request.",
          "error"
        );
        return;
      }

      if (!data.challengeId) {
        showNotification(
          data.message ??
            "If the account exists, a password reset OTP has been sent to the registered mobile number.",
          "success"
        );

        return;
      }

      setChallengeId(data.challengeId);
      setForgotLoginError("");

      const maskedMobile =
        data.maskedMobile ||
        data.mobileMasked ||
        "";
      const maskedEmail =
        data.maskedEmail ||
        data.emailMasked ||
        "";

      const fallbackContact = maskResetContact(forgotContact);
      const deliveryTargets = [
        maskedMobile,
        maskedEmail,
      ].filter(Boolean);

      const maskedTargets = deliveryTargets.length
        ? deliveryTargets.join(" / ")
        : fallbackContact;

      const deliveryMessage = maskedTargets
        ? `OTP has been sent to ${maskedTargets}.`
        : "OTP has been sent to your registered mobile number / Email.";

      setOtpDeliveryMessage(deliveryMessage);
      setOtp("");
      setAuthMode("forgot-otp");

      showNotification(
        deliveryMessage,
        "success"
      );
      setOtpSecondsLeft(OTP_DURATION_SECONDS);
      setResendSecondsLeft(
        RESEND_COOLDOWN_SECONDS
      );
    } catch (error) {
      console.error(
        "Password reset request failed:",
        error
      );

      showNotification(
        "Unable to connect to the server. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * VERIFY PASSWORD RESET OTP
   */
  async function handleVerifyPasswordResetOtp(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (otpSecondsLeft <= 0) {
      showNotification(
        "OTP has expired. Please resend a new OTP.",
        "error"
      );
      return;
    }

    if (otp.length !== 6) {
      showNotification(
        "Please enter the 6-digit OTP.",
        "error"
      );
      return;
    }

    setNotification(null);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/verify-reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challengeId,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setOtpError(true);

        showNotification(
          data.message ??
            "OTP verification failed.",
          "error"
        );
        return;
      }

      if (!data.resetToken) {
        showNotification(
          "Invalid password reset response.",
          "error"
        );
        return;
      }

      setResetToken(data.resetToken);
      setOtp("");
      setOtpSecondsLeft(0);
      setResendSecondsLeft(0);
      setNewPassword("");
      setConfirmPassword("");
      setAuthMode("reset-password");

      showNotification(
        "OTP verified successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Password reset OTP verification failed:",
        error
      );

      setOtpError(true);

      showNotification(
        "Unable to verify OTP. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * RESET PASSWORD
   */
  async function handleResetPassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!resetToken) {
      showNotification(
        "Invalid password reset request.",
        "error"
      );
      return;
    }

    if (!newPassword) {
      showNotification(
        "Please enter your new password.",
        "error"
      );
      return;
    }

    if (newPassword.length < 6) {
      showNotification(
        "Password must be at least 6 characters.",
        "error"
      );
      return;
    }

    if (!confirmPassword) {
      showNotification(
        "Please confirm your new password.",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification(
        "Passwords do not match.",
        "error"
      );
      return;
    }

    setNotification(null);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetToken,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showNotification(
          data.message ??
            "Unable to reset password.",
          "error"
        );
        return;
      }

      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setChallengeId("");
      setOtp("");
      setAuthMode("reset-success");

      showNotification(
        "Your password has been reset successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Reset password failed:",
        error
      );

      showNotification(
        "Unable to reset password. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * BACK TO LOGIN
   */
  function handleBackToLogin() {
    setAuthMode("login");
    setOtp("");
    setOtpError(false);
    setChallengeId("");
    setResetToken("");
    setForgotLogin("");
    setForgotLoginError("");
    setForgotLoginValid(false);
    setNewPassword("");
    setConfirmPassword("");
    setOtpSecondsLeft(0);
    setResendSecondsLeft(0);
    setNotification(null);
  }


  /*
   * BRAND PANEL
   */
  function BrandPanel() {
    return (
      <div className="relative hidden h-screen min-h-0 overflow-hidden lg:flex lg:w-1/2">
        {/* Transparent green overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-emerald-900/40 to-emerald-800/20" />

        {/* Decorative glow */}
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative z-10 flex h-full w-full flex-col p-8 xl:p-10">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
                <ShoppingBag
                  className="h-7 w-7 text-emerald-700"
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <h1 className="text-4xl font-black tracking-tight text-white">
                  KOTOZE
                </h1>

                <p className="text-sm font-medium tracking-wide text-emerald-50">
                  Everything You Need. One Place.
                </p>
              </div>
            </div>

            {/* TRUST BADGE */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              <CheckCircle2 className="h-4 w-4 text-emerald-200" />
              Your trusted marketplace
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="mt-auto mb-4 max-w-xl">
            <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Everything you need,
              <span className="block text-emerald-200">
                all in one place.
              </span>
            </h2>

            <p className="mt-3 max-w-lg text-base leading-6 text-white/90 xl:text-lg xl:leading-7">
              Kotoze brings quality products,
              trusted sellers, great value and
              reliable service together in one
              convenient marketplace.
            </p>

            {/* FEATURES */}
            <div className="mt-5 space-y-3">
              <Feature
                icon={<ShieldCheck />}
                title="Quality You Can Trust"
                description="Carefully selected products from reliable sellers."
              />

              <Feature
                icon={<Truck />}
                title="Fast & Reliable Delivery"
                description="Get your orders delivered safely and on time."
              />

              <Feature
                icon={<RotateCcw />}
                title="Easy Returns"
                description="A simple and hassle-free return experience."
              />

              <Feature
                icon={<Headphones />}
                title="Customer First"
                description="We're here whenever you need assistance."
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-3">
            <p className="text-sm text-white/80">
              © 2026 Kotoze. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-sm text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-200" />
              Secure & Trusted
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * OTP PANEL
   */
  function LoginOtpPanel() {
    const otpExpired = otpSecondsLeft <= 0;

    return (
      <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-7 shadow-2xl sm:p-8">
        {/* MOBILE LOGO */}
        <div className="mb-8 flex items-center justify-center lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-emerald-800">
                KOTOZE
              </h1>
              <p className="text-xs text-gray-500">
                Everything You Need. One Place.
              </p>
            </div>
          </div>
        </div>

        {/* HEADING */}
        <div className="mb-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Verify OTP
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter the 6-digit OTP sent to your
            registered mobile number.
          </p>
        </div>

        <form
          onSubmit={handleVerifyOtp}
          className="space-y-5"
        >
          {/* OTP INPUT */}
          <div>
            <div className="mb-3 flex min-h-[22px] items-center justify-between gap-3">
              <label className="text-sm font-semibold text-gray-700">
                One-Time Password
              </label>
            
              <div className="flex min-h-[22px] flex-1 items-center justify-end">
                {notification && (
                  <div
                    className={`flex items-center gap-1.5 text-right text-sm font-medium ${
                      notification.type === "error"
                        ? "text-red-600"
                        : notification.type === "success"
                          ? "text-emerald-700"
                          : "text-blue-600"
                    }`}
                  >
                    {notification.type === "error" ? (
                      <XCircle className="h-4 w-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    )}
            
                    <span>
                      {notification.type === "error" &&
                      notification.message
                        .toLowerCase()
                        .includes("invalid otp")
                        ? "Invalid OTP."
                        : notification.message}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index] ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(
                      /\D/g,
                      ""
                    );

                    if (!value) {
                      return;
                    }

                    setOtpError(false);
                    setNotification(null);

                    const otpArray = otp.split("");
                    otpArray[index] = value;

                    const newOtp = otpArray
                      .join("")
                      .slice(0, 6);

                    setOtp(newOtp);

                    if (index < 5) {
                      document
                        .getElementById(`otp-${index + 1}`)
                        ?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !otp[index] &&
                      index > 0
                    ) {
                      document
                        .getElementById(`otp-${index - 1}`)
                        ?.focus();
                    }
                  }}
                  className={`h-14 w-full rounded-xl border-2 text-center text-xl font-bold text-gray-900 outline-none transition ${
                    otpError
                      ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-500/10"
                      : "border-gray-300 bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* TIMER */}
          <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
            {otpExpired ? (
              <p className="text-sm font-semibold text-red-600">
                OTP has expired.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                OTP expires in{" "}
                <span className="font-bold text-gray-800">
                  {formatTime(otpSecondsLeft)}
                </span>
              </p>
            )}
          </div>

          {/* VERIFY */}
          <button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6 ||
              otpExpired
            }
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
            {!loading && (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>

          {/* RESEND */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={
              loading ||
              resendSecondsLeft > 0
            }
            className="w-full text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {resendSecondsLeft > 0
              ? `Resend OTP in ${formatTime(
                  resendSecondsLeft
                )}`
              : "Didn't receive the OTP? Resend"}
          </button>

          {/* BACK */}
          <button
            type="button"
            onClick={handleBackToLogin}
            disabled={loading}
            className="w-full text-sm font-medium text-gray-500 transition hover:text-gray-800 disabled:opacity-50"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    );
  }

  /*
   * FORGOT PASSWORD PANEL
   */
  function ForgotPasswordPanel() {
    return (
      <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-7 shadow-2xl sm:p-8">
        <div className="mb-8 flex items-center justify-center lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-emerald-800">KOTOZE</h1>
              <p className="text-xs text-gray-500">Everything You Need. One Place.</p>
            </div>
          </div>
        </div>

        <div className="mb-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your registered username and registered mobile number / Email. We will send an OTP to your registered contact details.
          </p>
        </div>

        <form onSubmit={handleRequestPasswordReset} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Username</label>
            <input
              ref={forgotLoginInputRef}
              type="text"
              value={forgotLogin}
              onChange={(e) => {
                setForgotLogin(e.target.value);
                setForgotLoginError("");
                setForgotLoginValid(false);
              }}
              onKeyDown={async (e) => {
                if (e.key !== "Enter") return;

                e.preventDefault();

                const usernameValid = await validateForgotUsername(
                  forgotLogin,
                  true,
                  true
                );

                if (usernameValid) {
                  forgotContactInputRef.current?.focus();
                }
              }}
              placeholder="Enter username"
              autoComplete="username"
              className={`h-12 w-full rounded-2xl border bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                forgotLoginError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  : forgotLoginValid
                    ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10"
                    : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10"
              }`}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Registered Mobile Number / Email
            </label>
            <input
              ref={forgotContactInputRef}
              type="text"
              value={forgotContact}
              onChange={(e) => {
                const value = e.target.value;

                // Keep numeric mobile input to a maximum of 10 digits.
                // Email input remains unrestricted by this rule.
                if (/^\d+$/.test(value) && value.length > 10) {
                  return;
                }

                setForgotContact(value);
                setForgotLoginError("");
              }}
              placeholder="Enter registered mobile number or email"
              autoComplete="email"
              className={`h-12 w-full rounded-2xl border bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                forgotLoginError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10"
              }`}
            />

            <div className="mt-2 min-h-[48px]">
              {forgotLoginError && (
                <div className="flex items-start gap-2 text-sm leading-5 text-red-600">
                  <span className="mt-0.5 shrink-0 text-base">⚠</span>
                  <p>{forgotLoginError}</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !forgotLogin.trim() ||
              !forgotContact.trim()
            }
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={handleBackToLogin}
            disabled={loading}
            className="w-full text-sm font-medium text-gray-500 transition hover:text-gray-800 disabled:opacity-50"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    );
  }

  /*
   * PASSWORD RESET OTP PANEL
   */
  function ForgotOtpPanel() {
    const otpExpired = otpSecondsLeft <= 0;

    return (
      <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-7 shadow-2xl sm:p-8">
        <div className="mb-8 flex items-center justify-center lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-emerald-800">
                KOTOZE
              </h1>
              <p className="text-xs text-gray-500">
                Everything You Need. One Place.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Verify Reset OTP
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {otpDeliveryMessage ||
              "Enter the 6-digit OTP sent to your registered mobile number / Email."}
          </p>
        </div>

        <form
          onSubmit={handleVerifyPasswordResetOtp}
          className="space-y-5"
        >
          <div>
            <div className="mb-3 flex min-h-[22px] items-center justify-between gap-3">
              <label className="text-sm font-semibold text-gray-700">
                One-Time Password
              </label>
            
              <div className="flex min-h-[22px] flex-1 items-center justify-end">
                {notification && (
                  <div
                    className={`flex items-center gap-1.5 text-right text-sm font-medium ${
                      notification.type === "error"
                        ? "text-red-600"
                        : notification.type === "success"
                          ? "text-emerald-700"
                          : "text-blue-600"
                    }`}
                  >
                    {notification.type === "error" ? (
                      <XCircle className="h-4 w-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    )}
            
                    <span>
                      {notification.type === "error" &&
                      notification.message
                        .toLowerCase()
                        .includes("invalid otp")
                        ? "Invalid OTP."
                        : notification.message}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  id={`reset-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index] ?? ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(
                      /\D/g,
                      ""
                    );

                    if (!value) {
                      return;
                    }

                    setOtpError(false);
                    setNotification(null);

                    const otpArray = otp.split("");
                    otpArray[index] = value;

                    const newOtp = otpArray
                      .join("")
                      .slice(0, 6);

                    setOtp(newOtp);

                    if (index < 5) {
                      document
                        .getElementById(
                          `reset-otp-${index + 1}`
                        )
                        ?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !otp[index] &&
                      index > 0
                    ) {
                      document
                        .getElementById(
                          `reset-otp-${index - 1}`
                        )
                        ?.focus();
                    }
                  }}
                  className={`h-14 w-full rounded-xl border-2 text-center text-xl font-bold text-gray-900 outline-none transition ${
                    otpError
                      ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-500/10"
                      : "border-gray-300 bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
            {otpExpired ? (
              <p className="text-sm font-semibold text-red-600">
                OTP has expired.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                OTP expires in{" "}
                <span className="font-bold text-gray-800">
                  {formatTime(otpSecondsLeft)}
                </span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6 ||
              otpExpired
            }
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
            {!loading && (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={
              loading ||
              resendSecondsLeft > 0
            }
            className="w-full text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {resendSecondsLeft > 0
              ? `Resend OTP in ${formatTime(
                  resendSecondsLeft
                )}`
              : "Didn't receive the OTP? Resend"}
          </button>

          <button
            type="button"
            onClick={handleBackToLogin}
            disabled={loading}
            className="w-full text-sm font-medium text-gray-500 transition hover:text-gray-800 disabled:opacity-50"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    );
  }

  /*
   * RESET PASSWORD PANEL
   */
  function ResetPasswordPanel() {
    return (
      <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-7 shadow-2xl sm:p-8">
        <div className="mb-8 flex items-center justify-center lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-emerald-800">KOTOZE</h1>
              <p className="text-xs text-gray-500">Everything You Need. One Place.</p>
            </div>
          </div>
        </div>

        <div className="mb-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Create New Password</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">Set a new password for your Kotoze account.</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <PasswordInput value={newPassword} onChange={setNewPassword} />

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          <p className="text-xs text-gray-500">Password must be at least 6 characters.</p>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        {/* CANCEL */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium text-gray-400">
            or
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleBackToLogin}
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <XCircle className="h-5 w-5" />
          Cancel
        </button>
      </div>
    );
  }

  /*
   * RESET SUCCESS PANEL
   */
  function ResetSuccessPanel() {
    return (
      <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-2xl sm:p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-9 w-9 text-emerald-700" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Password Reset Successful</h2>
        <p className="mt-3 text-sm leading-6 text-gray-500">Your password has been changed successfully. You can now sign in with your new password.</p>
        <button
          type="button"
          onClick={handleBackToLogin}
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
        >
          Back to Login
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    );
  }

  /*
   * LOGIN PANEL
   */
  function LoginPanel() {
    return (
      <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-7 shadow-2xl sm:p-8">
        {/* MOBILE LOGO */}
        <div className="mb-8 flex items-center justify-center lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-emerald-800">
                KOTOZE
              </h1>

              <p className="text-xs text-gray-500">
                Everything You Need. One Place.
              </p>
            </div>
          </div>
        </div>

        {/* HEADING */}
        <div className="mb-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Welcome back
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Sign in to Kotoze
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your dashboard.
          </p>
        </div>

        {/* LOGIN NOTIFICATION */}
        <div className="relative mb-3 h-10">
          {(loginError || passwordError) && (
            <div className="absolute inset-x-0 top-0 flex items-start gap-2 text-sm leading-5 text-red-600">
              <span className="mt-0.5 shrink-0 text-base">⚠</span>
              <p>{loginError || passwordError}</p>
            </div>
          )}
        </div>

        <form
          onSubmit={handleLogin}
          className="relative space-y-4"
        >
          {/* LOGIN */}
          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Username
            </label>

            <div className="relative">
              <input
                type="text"
                value={login}
                onChange={(e) => {
                  setLogin(e.target.value);
                  setLoginError("");
                  setPasswordError("");
                  setShowLoginSuggestions(true);
                }}
                onKeyDown={async (e) => {
                  if (e.key !== "Enter") {
                    return;
                  }

                  e.preventDefault();

                  if (loading) {
                    return;
                  }

                  const usernameValid =
                    await validateLoginUsername();

                  if (!usernameValid) {
                    return;
                  }

                  window.setTimeout(() => {
                    document
                      .querySelector<HTMLInputElement>(
                        'input[type="password"]'
                      )
                      ?.focus();
                  }, 0);
                }}
                onFocus={() => {
                  setShowLoginSuggestions(true);
                }}
                onBlur={() => {
                  /*
                   * Small delay allows a suggestion
                   * button to receive the click before
                   * the dropdown closes.
                   */
                  window.setTimeout(() => {
                    setShowLoginSuggestions(false);
                  }, 150);
                }}
                placeholder="Enter username"
                autoComplete="username"
                className={`h-12 w-full rounded-2xl border bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                  loginError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10"
                }`}
                required
              />
              {showLoginSuggestions &&
                filteredRememberedLogins.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    {filteredRememberedLogins.map(
                      (savedLogin) => (
                        <button
                          key={savedLogin}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                          }}
                          onClick={() =>
                            selectRememberedLogin(
                              savedLogin
                            )
                          }
                          className="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <span className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">
                            {savedLogin
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <span className="truncate">
                            {savedLogin}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-800 disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>

            <PasswordInput
              value={password}
              onChange={(value) => {
                setPassword(value);
                setPasswordError("");
              }}
            />
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-500"
              />

              <span>Remember Me</span>
            </label>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing In..."
              : "Login"}

            {!loading && (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>
        </form>

        {/* SECURITY ITEMS */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <TrustItem
            icon={<ShieldCheck />}
            text="Secure Login"
          />

          <TrustItem
            icon={<ShoppingBag />}
            text="Trusted Marketplace"
          />

          <TrustItem
            icon={<Headphones />}
            text="24/7 Support"
          />
        </div>
      </div>
    );
  }

  /*
   * MAIN SCREEN
   */
  return (
    <main
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('${BACKGROUND_IMAGE}')`,
      }}
    >
      <div className="flex min-h-screen w-full">
        {/* LEFT SIDE */}
        {BrandPanel()}

        {/* RIGHT SIDE */}
      <section className="flex h-screen min-h-screen w-full items-start justify-center overflow-y-auto bg-transparent px-5 py-8 sm:px-8 sm:py-10 lg:w-1/2 lg:justify-end lg:pr-8 lg:py-10 xl:pr-12">
          {authMode === "login"
            ? LoginPanel()
            : authMode === "login-otp"
              ? LoginOtpPanel()
              : authMode === "forgot"
                ? ForgotPasswordPanel()
                : authMode === "forgot-otp"
                  ? ForgotOtpPanel()
                  : authMode === "reset-password"
                    ? ResetPasswordPanel()
                    : ResetSuccessPanel()}
        </section>
      </div>
    </main>
  );
}

/*
 * FEATURE
 */
function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-emerald-50 backdrop-blur-md">
        <span className="h-5 w-5">
          {icon}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-white/80">
          {description}
        </p>
      </div>
    </div>
  );
}

/*
 * TRUST ITEM
 */
function TrustItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 px-2 py-3 text-center">
      <span className="mb-1 h-5 w-5 text-emerald-700">
        {icon}
      </span>

      <span className="text-[11px] font-medium leading-4 text-gray-500">
        {text}
      </span>
    </div>
  );
}