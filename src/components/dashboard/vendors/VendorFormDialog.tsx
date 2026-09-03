"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Vendor,
  VendorFormData,
  createVendor,
  updateVendor,
} from "@/lib/api/vendor";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/common/PhoneInput";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
  onSuccess: () => void;
}

/*
 * Email validation.
 *
 * Email is optional.
 * If entered, it must be valid.
 */
function isValidEmail(
  email: string
): boolean {
  if (!email.trim()) {
    return true;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(
    email.trim()
  );
}

/*
 * PAN validation.
 *
 * PAN format:
 *
 * 5 letters
 * 4 digits
 * 1 letter
 *
 * Example:
 * ABCDE1234F
 */
function isValidPAN(
  pan: string
): boolean {
  if (!pan.trim()) {
    return true;
  }

  const panPattern =
    /^[A-Z]{5}[0-9]{4}[A-Z]$/;

  return panPattern.test(
    pan.trim().toUpperCase()
  );
}

/*
 * GSTIN validation.
 *
 * Standard GSTIN:
 *
 * 2 digits
 * 5 letters
 * 4 digits
 * 1 letter
 * 1 alphanumeric
 * Z
 * 1 alphanumeric
 *
 * Total = 15 characters
 *
 * Example:
 * 32ABCDE1234F1Z5
 */
function isValidGST(
  gst: string
): boolean {
  if (!gst.trim()) {
    return true;
  }

  const gstPattern =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/;

  return gstPattern.test(
    gst.trim().toUpperCase()
  );
}

export default function VendorFormDialog({
  open,
  onOpenChange,
  vendor,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [businessName, setBusinessName] =
    useState("");

  const [legalName, setLegalName] =
    useState("");

  const [contactPerson, setContactPerson] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [emailTouched, setEmailTouched] =
    useState(false);

  const [mobile, setMobile] =
    useState("");

  const [mobileValid, setMobileValid] =
    useState(false);

  const [gstNumber, setGstNumber] =
    useState("");

  const [gstTouched, setGstTouched] =
    useState(false);

  const [panNumber, setPanNumber] =
    useState("");

  const [panTouched, setPanTouched] =
    useState(false);

  const [status, setStatus] =
    useState<
      "ACTIVE" |
      "INACTIVE" |
      "BLOCKED"
    >("ACTIVE");

  const [
    approvalStatus,
    setApprovalStatus,
  ] = useState<
    "PENDING" |
    "APPROVED" |
    "REJECTED"
  >("PENDING");

  const emailInputRef =
    useRef<HTMLInputElement>(null);

  const gstInputRef =
    useRef<HTMLInputElement>(null);

  const panInputRef =
    useRef<HTMLInputElement>(null);

  /*
   * Email validity.
   *
   * Empty email is allowed.
   */
  const emailValid =
    isValidEmail(email);

  /*
   * PAN validity.
   *
   * Empty PAN is allowed.
   */
  const panValid =
    isValidPAN(panNumber);

  /*
   * GST validity.
   *
   * Empty GST is allowed.
   */
  const gstValid =
    isValidGST(gstNumber);

  /*
   * Error visibility.
   */
  const showEmailError =
    emailTouched &&
    email.trim().length > 0 &&
    !emailValid;

  const showPANError =
    panTouched &&
    panNumber.trim().length > 0 &&
    !panValid;

  const showGSTError =
    gstTouched &&
    gstNumber.trim().length > 0 &&
    !gstValid;

  /*
   * Load existing vendor / reset
   * form when dialog opens.
   */
  useEffect(() => {
    if (vendor) {
      setBusinessName(
        vendor.businessName
      );

      setLegalName(
        vendor.legalName ?? ""
      );

      setContactPerson(
        vendor.contactPerson
      );

      setEmail(
        vendor.email ?? ""
      );

      setEmailTouched(false);

      setMobile(vendor.mobile);

      setMobileValid(false);

      setGstNumber(
        vendor.gstNumber ?? ""
      );

      setGstTouched(false);

      setPanNumber(
        vendor.panNumber ?? ""
      );

      setPanTouched(false);

      setStatus(vendor.status);

      setApprovalStatus(
        vendor.approvalStatus
      );
    } else {
      setBusinessName("");
      setLegalName("");
      setContactPerson("");
      setEmail("");
      setEmailTouched(false);
      setMobile("");
      setMobileValid(false);
      setGstNumber("");
      setGstTouched(false);
      setPanNumber("");
      setPanTouched(false);
      setStatus("ACTIVE");
      setApprovalStatus("PENDING");
    }
  }, [vendor, open]);

  /*
   * Email changed.
   */
  function handleEmailChange(
    value: string
  ) {
    setEmail(value);
    setEmailTouched(true);
  }

  /*
   * Email blur.
   */
  function handleEmailBlur() {
    if (!email.trim()) {
      return;
    }

    setEmailTouched(true);

    if (!isValidEmail(email)) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 0);
    }
  }

  /*
   * Email keyboard navigation.
   */
  function handleEmailKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      (event.key === "Tab" ||
        event.key === "Enter") &&
      email.trim().length > 0 &&
      !emailValid
    ) {
      event.preventDefault();

      setEmailTouched(true);

      emailInputRef.current?.focus();
    }
  }

  /*
   * PAN changed.
   *
   * Automatically convert to uppercase.
   */
  function handlePANChange(
    value: string
  ) {
    const upperValue =
      value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 10);

    setPanNumber(upperValue);
    setPanTouched(true);
  }

  /*
   * PAN blur.
   */
  function handlePANBlur() {
    if (!panNumber.trim()) {
      return;
    }

    setPanTouched(true);

    if (!isValidPAN(panNumber)) {
      setTimeout(() => {
        panInputRef.current?.focus();
      }, 0);
    }
  }

  /*
   * PAN keyboard navigation.
   */
  function handlePANKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      (event.key === "Tab" ||
        event.key === "Enter") &&
      panNumber.trim().length > 0 &&
      !panValid
    ) {
      event.preventDefault();

      setPanTouched(true);

      panInputRef.current?.focus();
    }
  }

  /*
   * GST changed.
   *
   * Automatically convert to uppercase.
   */
  function handleGSTChange(
    value: string
  ) {
    const upperValue =
      value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 15);

    setGstNumber(upperValue);
    setGstTouched(true);
  }

  /*
   * GST blur.
   */
  function handleGSTBlur() {
    if (!gstNumber.trim()) {
      return;
    }

    setGstTouched(true);

    if (!isValidGST(gstNumber)) {
      setTimeout(() => {
        gstInputRef.current?.focus();
      }, 0);
    }
  }

  /*
   * GST keyboard navigation.
   */
  function handleGSTKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      (event.key === "Tab" ||
        event.key === "Enter") &&
      gstNumber.trim().length > 0 &&
      !gstValid
    ) {
      event.preventDefault();

      setGstTouched(true);

      gstInputRef.current?.focus();
    }
  }

  async function handleSubmit() {
    /*
     * Validate email.
     */
    if (!emailValid) {
      setEmailTouched(true);
      emailInputRef.current?.focus();
      return;
    }

    /*
     * Validate PAN.
     */
    if (!panValid) {
      setPanTouched(true);
      panInputRef.current?.focus();
      return;
    }

    /*
     * Validate GST.
     */
    if (!gstValid) {
      setGstTouched(true);
      gstInputRef.current?.focus();
      return;
    }

    /*
     * Validate mobile.
     */
    if (!mobileValid) {
      return;
    }

    try {
      setLoading(true);

      const payload: VendorFormData = {
        businessName,
        legalName,
        contactPerson,
        email,
        mobile,
        gstNumber,
        panNumber,
        status,
        approvalStatus,
      };

      if (vendor) {
        await updateVendor(
          vendor._id,
          payload
        );
      } else {
        await createVendor(
          payload
        );
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Create / Update button enabled
   * only when all validations pass.
   */
  const canSubmit =
    !loading &&
    businessName.trim().length > 0 &&
    contactPerson.trim().length > 0 &&
    mobileValid &&
    emailValid &&
    panValid &&
    gstValid;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[640px] max-w-[640px] max-h-[85vh] overflow-y-auto px-6 py-4">
        <DialogHeader className="space-y-1">
          <DialogTitle>
            {vendor
              ? "Edit Vendor"
              : "Add Vendor"}
          </DialogTitle>

          <DialogDescription>
            {vendor
              ? "Update vendor information."
              : "Create a new vendor."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full grid-cols-[285px_285px] gap-x-4 gap-y-3 pb-2">

          {/* Business Name */}
          <div className="w-[285px]">
            <label className="mb-1.5 block text-sm font-medium">
              Business Name
            </label>

            <Input
              value={businessName}
              onChange={(e) =>
                setBusinessName(
                  e.target.value
                )
              }
              placeholder="Enter business name"
            />
          </div>

          {/* Legal Name */}
          <div className="w-[285px]">
            <label className="mb-1.5 block text-sm font-medium">
              Legal Name
            </label>

            <Input
              value={legalName}
              onChange={(e) =>
                setLegalName(
                  e.target.value
                )
              }
              placeholder="Enter legal name"
            />
          </div>

          {/* Contact Person */}
          <div className="w-[285px]">
            <label className="mb-1.5 block text-sm font-medium">
              Contact Person
            </label>

            <Input
              value={contactPerson}
              onChange={(e) =>
                setContactPerson(
                  e.target.value
                )
              }
              placeholder="Enter contact person"
            />
          </div>

          {/* Phone */}
          <div className="col-span-2 w-full">
            <PhoneInput
              value={mobile}
              onChange={setMobile}
              onValidityChange={
                setMobileValid
              }
              excludedCountries={["PK"]}
            />
          </div>

          {/* Email */}
          <div className="w-[285px]">
            <label className="mb-1.5 block text-sm font-medium">
              Email
            </label>

            <Input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) =>
                handleEmailChange(
                  e.target.value
                )
              }
              onBlur={handleEmailBlur}
              onKeyDown={
                handleEmailKeyDown
              }
              placeholder="Enter email address"
              className={
                showEmailError
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />

            {showEmailError && (
              <p className="mt-1 max-w-[285px] text-xs leading-4 text-red-500">
                Please enter a valid email address.
              </p>
            )}
          </div>

          {/* GST Number */}
          <div className="w-[160px]">
            <label className="mb-1.5 block text-sm font-medium">
              GST Number
            </label>

            <Input
              ref={gstInputRef}
              value={gstNumber}
              maxLength={15}
              onChange={(e) =>
                handleGSTChange(
                  e.target.value
                )
              }
              onBlur={handleGSTBlur}
              onKeyDown={
                handleGSTKeyDown
              }
              placeholder="Enter GST number"
              className={
                showGSTError
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />

            {showGSTError && (
              <p className="mt-1 max-w-[160px] text-xs leading-4 text-red-500">
                Enter a valid 15-character GST number.
              </p>
            )}
          </div>

          {/* PAN + Status + Approval Status */}
          <div className="col-span-2 flex items-end gap-4">

            {/* PAN Number */}
            <div className="w-[160px]">
              <label className="mb-1.5 block text-sm font-medium">
                PAN Number
              </label>

              <Input
                ref={panInputRef}
                value={panNumber}
                maxLength={10}
                onChange={(e) =>
                  handlePANChange(
                    e.target.value
                  )
                }
                onBlur={handlePANBlur}
                onKeyDown={
                  handlePANKeyDown
                }
                placeholder="Enter PAN number"
                className={
                  showPANError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />

              {showPANError && (
                <p className="mt-1 max-w-[160px] text-xs leading-4 text-red-500">
                  Enter a valid 10-character PAN.
                </p>
              )}
            </div>

            {/* Status */}
            <div className="w-[120px]">
              <label className="mb-1.5 block text-sm font-medium">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as VendorFormData["status"]
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>

                <option value="BLOCKED">
                  Blocked
                </option>
              </select>
            </div>

            {/* Approval Status */}
            <div className="w-[120px]">
              <label className="mb-1.5 block text-sm font-medium">
                Approval Status
              </label>

              <select
                value={approvalStatus}
                onChange={(e) =>
                  setApprovalStatus(
                    e.target.value as VendorFormData["approvalStatus"]
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="APPROVED">
                  Approved
                </option>

                <option value="REJECTED">
                  Rejected
                </option>
              </select>
            </div>

          </div>
        </div>

        <DialogFooter className="pt-1">
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {loading
              ? "Saving..."
              : vendor
              ? "Update Vendor"
              : "Create Vendor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}