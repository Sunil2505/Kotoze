"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CountryCode,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidityChange?: (valid: boolean) => void;
  excludedCountries?: CountryCode[];
  disabled?: boolean;
}

/*
 * Mobile-number lengths.
 *
 * For countries listed here, the mobile
 * number must contain exactly this
 * number of digits.
 */
const MOBILE_MAX_LENGTHS:
  Partial<Record<CountryCode, number>> = {
  IN: 10,
  HK: 8,
  AE: 9,
  US: 10,
  CA: 10,
  GB: 10,
  AU: 9,
  NZ: 9,
  SG: 8,
  MY: 10,
  TH: 9,
  ID: 12,
  PH: 10,
  VN: 10,
  JP: 10,
  KR: 10,
  CN: 11,
  TW: 10,
  BD: 10,
  LK: 9,
  NP: 10,
  PK: 10,
  SA: 9,
  QA: 8,
  KW: 8,
  BH: 8,
  OM: 8,
  JO: 9,
  IL: 9,
  DE: 11,
  FR: 9,
  IT: 10,
  ES: 9,
  PT: 9,
  NL: 9,
  BE: 9,
  CH: 9,
  AT: 10,
  SE: 9,
  NO: 8,
  DK: 8,
  FI: 10,
  IE: 9,
  PL: 9,
  CZ: 9,
  HU: 9,
  RO: 9,
  GR: 10,
  TR: 10,
  RU: 10,
  UA: 9,
  ZA: 9,
  NG: 10,
  KE: 9,
  GH: 9,
  TZ: 9,
  UG: 9,
  EG: 10,
  MA: 9,
  DZ: 9,
  TN: 8,
  BR: 11,
  AR: 10,
  CL: 9,
  CO: 10,
  PE: 9,
  MX: 10,
};

/*
 * Countries not explicitly configured
 * will allow 7 to 15 digits.
 */
const DEFAULT_MIN_LENGTH = 7;
const DEFAULT_MAX_LENGTH = 15;

function getCountryName(
  country: CountryCode
) {
  try {
    const displayNames =
      new Intl.DisplayNames(
        ["en"],
        { type: "region" }
      );

    return (
      displayNames.of(country) ??
      country
    );
  } catch {
    return country;
  }
}

/*
 * Get maximum allowed length.
 */
function getMaximumMobileLength(
  country: CountryCode
): number {
  return (
    MOBILE_MAX_LENGTHS[country] ??
    DEFAULT_MAX_LENGTH
  );
}

/*
 * Get minimum required length.
 *
 * For countries explicitly configured
 * above, minimum = maximum.
 *
 * Example:
 *
 * India     → 10 to 10
 * Hong Kong → 8 to 8
 */
function getMinimumMobileLength(
  country: CountryCode
): number {
  return (
    MOBILE_MAX_LENGTHS[country] ??
    DEFAULT_MIN_LENGTH
  );
}

/*
 * Get validation status.
 */
function getPhoneValidation(
  country: CountryCode,
  nationalNumber: string
): "TOO_SHORT" | "TOO_LONG" | undefined {
  const minimumLength =
    getMinimumMobileLength(country);

  const maximumLength =
    getMaximumMobileLength(country);

  if (
    nationalNumber.length <
    minimumLength
  ) {
    return "TOO_SHORT";
  }

  if (
    nationalNumber.length >
    maximumLength
  ) {
    return "TOO_LONG";
  }

  return undefined;
}

export default function PhoneInput({
  value,
  onChange,
  onValidityChange,
  excludedCountries = [],
  disabled = false,
}: PhoneInputProps) {
  const countries = useMemo(() => {
    return getCountries()
      .filter(
        (country) =>
          !excludedCountries.includes(
            country
          )
      )
      .map((country) => ({
        code: country,
        name: getCountryName(country),
        callingCode:
          getCountryCallingCode(country),
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [excludedCountries]);

  const [
    selectedCountry,
    setSelectedCountry,
  ] = useState<CountryCode>("IN");

  const [
    mobileNumber,
    setMobileNumber,
  ] = useState("");

  const [
    showError,
    setShowError,
  ] = useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  /*
   * Current validation.
   */
  const validationResult =
    getPhoneValidation(
      selectedCountry,
      mobileNumber
    );

  /*
   * Number is valid only when it
   * exactly satisfies the country's
   * configured mobile-number length.
   */
  const isValid =
    mobileNumber.length > 0 &&
    validationResult === undefined;

  /*
   * Inform parent component about
   * current phone validity.
   */
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [
    isValid,
    onValidityChange,
  ]);

  /*
   * Load existing value when editing.
   */
  useEffect(() => {
    if (!value) {
      setSelectedCountry("IN");
      setMobileNumber("");
      setShowError(false);
      return;
    }

    if (!value.startsWith("+")) {
      setMobileNumber(
        value.replace(/\D/g, "")
      );
      return;
    }

    /*
     * Find country by calling code.
     */
    const matchingCountry =
      countries.find((country) =>
        value.startsWith(
          `+${country.callingCode}`
        )
      );

    if (matchingCountry) {
      const prefix =
        `+${matchingCountry.callingCode}`;

      setSelectedCountry(
        matchingCountry.code
      );

      setMobileNumber(
        value
          .slice(prefix.length)
          .replace(/\D/g, "")
      );

      return;
    }

    setMobileNumber(
      value.replace(/\D/g, "")
    );
  }, [value, countries]);

  /*
   * Country changed.
   */
  function handleCountryChange(
    country: CountryCode
  ) {
    setSelectedCountry(country);
    setMobileNumber("");
    setShowError(false);

    onChange("");
  }

  /*
   * Mobile number changed.
   */
  function handleMobileChange(
    input: string
  ) {
    /*
     * Numbers only.
     */
    const numericValue =
      input.replace(/\D/g, "");

    const maximumLength =
      getMaximumMobileLength(
        selectedCountry
      );

    /*
     * Do not allow more than
     * maximum digits.
     */
    if (
      numericValue.length >
      maximumLength
    ) {
      return;
    }

    setMobileNumber(numericValue);

    /*
     * Show validation once the user
     * starts entering the number.
     */
    setShowError(true);

    /*
     * Empty number.
     */
    if (!numericValue) {
      onChange("");
      return;
    }

    const callingCode =
      getCountryCallingCode(
        selectedCountry
      );

    /*
     * Store international format.
     */
    onChange(
      `+${callingCode}${numericValue}`
    );
  }

  /*
   * Prevent leaving the mobile field
   * when the number is invalid.
   */
  function handleBlur() {
    if (!isValid) {
      setShowError(true);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  /*
   * Prevent Tab / Enter when the
   * mobile number is incomplete.
   */
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      (event.key === "Tab" ||
        event.key === "Enter") &&
      !isValid
    ) {
      event.preventDefault();

      setShowError(true);

      inputRef.current?.focus();
    }
  }

  const minimumLength =
    getMinimumMobileLength(
      selectedCountry
    );

  const maximumLength =
    getMaximumMobileLength(
      selectedCountry
    );

  /*
   * Error message.
   */
  let errorMessage = "";

  if (
    showError &&
    validationResult === "TOO_SHORT"
  ) {
    if (minimumLength === maximumLength) {
      errorMessage =
        `Mobile number must be ${minimumLength} digits.`;
    } else {
      errorMessage =
        `Mobile number must be at least ${minimumLength} digits.`;
    }
  }

  if (
    showError &&
    validationResult === "TOO_LONG"
  ) {
    errorMessage =
      `Mobile number cannot exceed ${maximumLength} digits.`;
  }

  return (
    <div className="flex items-start gap-3">
      {/* Country Code */}
      <div className="w-[220px]">
        <label className="mb-1.5 block text-sm font-medium">
          Country Code
        </label>

        <select
          value={selectedCountry}
          onChange={(event) =>
            handleCountryChange(
              event.target.value as CountryCode
            )
          }
          disabled={disabled}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {countries.map((country) => (
            <option
              key={country.code}
              value={country.code}
            >
              {country.code} {country.name} +
              {country.callingCode}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Number */}
      <div className="w-[200px]">
        <label className="mb-1.5 block text-sm font-medium">
          Mobile Number
        </label>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={maximumLength}
          value={mobileNumber}
          onChange={(event) =>
            handleMobileChange(
              event.target.value
            )
          }
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Mobile number"
          disabled={disabled}
          className={`h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 ${
            showError && !isValid
              ? "border-red-500 focus:ring-red-500"
              : "border-input focus:ring-ring"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        />

        {errorMessage && (
          <p className="mt-1 max-w-[200px] text-xs leading-4 text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}