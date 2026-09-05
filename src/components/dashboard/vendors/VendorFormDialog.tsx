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

  const [submitError, setSubmitError] =
    useState("");

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

  /*
   * Drag state.
   *
   * The dialog itself stays in Radix's normal centered
   * position. During dragging we only apply a visual
   * translate offset, so there is no jump on pointer-down.
   */
  const [dragging, setDragging] =
    useState(false);

  const dialogContentRef =
    useRef<HTMLDivElement>(null);

  const dragFrameRef =
    useRef<number | null>(null);

  const dragStartRef =
    useRef({
      mouseX: 0,
      mouseY: 0,
      startX: 0,
      startY: 0,
      dialogLeft: 0,
      dialogTop: 0,
      dialogWidth: 0,
      dialogHeight: 0,
    });

  const pendingOffsetRef =
    useRef({
      x: 0,
      y: 0,
    });

  const emailInputRef =
    useRef<HTMLInputElement>(null);

  const gstInputRef =
    useRef<HTMLInputElement>(null);

  const panInputRef =
    useRef<HTMLInputElement>(null);

  const emailValid =
    isValidEmail(email);

  const panValid =
    isValidPAN(panNumber);

  const gstValid =
    isValidGST(gstNumber);

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
   * Every time the dialog opens, explicitly reset its
   * visual transform to the normal centered position.
   *
   * No position is persisted.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    setDragging(false);
    setSubmitError("");

    pendingOffsetRef.current = {
      x: 0,
      y: 0,
    };

    const frame =
      requestAnimationFrame(() => {
        const dialog =
          dialogContentRef.current;

        if (!dialog) {
          return;
        }

        dialog.style.transform =
          "translate(-50%, -50%)";

        dialog.style.translate = "0 0";
      });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [open]);

  /*
   * Clamp the drag offset so the complete dialog
   * remains inside the browser viewport.
   */
  function clampDragOffset(
    offsetX: number,
    offsetY: number,
    rect: DOMRect
  ) {
    if (typeof window === "undefined") {
      return {
        x: offsetX,
        y: offsetY,
      };
    }

    const padding = 20;

    const minX =
      padding - rect.left;

    const maxX =
      window.innerWidth -
      rect.width -
      padding -
      rect.left;

    const minY =
      padding - rect.top;

    const maxY =
      window.innerHeight -
      rect.height -
      padding -
      rect.top;

    return {
      x: Math.min(
        maxX,
        Math.max(minX, offsetX)
      ),
      y: Math.min(
        maxY,
        Math.max(minY, offsetY)
      ),
    };
  }

  /*
   * Header-only drag.
   *
   * Clicking/typing controls is never treated as a drag.
   */
  function handleDragStart(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (event.button !== 0) {
      return;
    }

    const target =
      event.target as HTMLElement;

    /*
     * Header title/description is draggable.
     * Interactive controls are not.
     */
    if (
      target.closest(
        [
          "button",
          "input",
          "select",
          "textarea",
          "a",
          "[role='button']",
          "[role='combobox']",
          "[role='listbox']",
          "[role='option']",
          "[contenteditable='true']",
        ].join(",")
      )
    ) {
      return;
    }

    const dialog =
      dialogContentRef.current;

    if (!dialog) {
      return;
    }

    const rect =
      dialog.getBoundingClientRect();

    /*
     * Capture the actual position at the exact
     * moment the user starts dragging.
     */
    dragStartRef.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      startX: 0,
      startY: 0,
      dialogLeft: rect.left,
      dialogTop: rect.top,
      dialogWidth: rect.width,
      dialogHeight: rect.height,
    };

    pendingOffsetRef.current = {
      x: 0,
      y: 0,
    };

    setDragging(true);

    event.preventDefault();

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  }

  /*
   * Smooth movement using requestAnimationFrame.
   *
   * The dialog remains centered structurally;
   * only its transform offset changes.
   */
  function handleDragMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (!dragging) {
      return;
    }

    const deltaX =
      event.clientX -
      dragStartRef.current.mouseX;

    const deltaY =
      event.clientY -
      dragStartRef.current.mouseY;

    const baseRect = {
      left:
        dragStartRef.current.dialogLeft,
      top:
        dragStartRef.current.dialogTop,
      width:
        dragStartRef.current.dialogWidth,
      height:
        dragStartRef.current.dialogHeight,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect;

    const next =
      clampDragOffset(
        dragStartRef.current.startX +
          deltaX,
        dragStartRef.current.startY +
          deltaY,
        baseRect
      );

    pendingOffsetRef.current = next;

    if (
      dragFrameRef.current !== null
    ) {
      return;
    }

    dragFrameRef.current =
      requestAnimationFrame(() => {
        dragFrameRef.current = null;

        const dialog =
          dialogContentRef.current;

        if (!dialog) {
          return;
        }

        const offset =
          pendingOffsetRef.current;

        dialog.style.transform =
          `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`;

        /*
         * Tailwind v4 / CSS individual translate
         * utilities can otherwise add their own
         * translation. Neutralize that separately.
         */
        dialog.style.translate = "0 0";
      });
  }

  /*
   * Finish the current drag.
   */
  function handleDragEnd(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (!dragging) {
      return;
    }

    if (
      dragFrameRef.current !== null
    ) {
      cancelAnimationFrame(
        dragFrameRef.current
      );

      dragFrameRef.current = null;
    }

    setDragging(false);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture may already be released.
    }
  }

  /*
   * Cleanup drag animation.
   */
  useEffect(() => {
    return () => {
      if (
        dragFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          dragFrameRef.current
        );
      }
    };
  }, []);

  function handleEmailChange(
    value: string
  ) {
    setEmail(value);
    setEmailTouched(true);
    setSubmitError("");
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
    setSubmitError("");
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
    setSubmitError("");
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
    setSubmitError("");

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
      setSubmitError(
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
      <DialogContent
        ref={dialogContentRef}
        className={`w-[640px] max-w-[640px] max-h-[85vh] overflow-y-auto px-6 py-4 ${
          dragging
            ? "select-none"
            : ""
        }`}
        style={{
          willChange: dragging
            ? "transform"
            : "auto",
        }}
      >
        <DialogHeader
          className={`space-y-1 touch-none ${
            dragging
              ? "cursor-grabbing"
              : "cursor-grab"
          }`}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
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
              onChange={(value) => {
                setMobile(value);
                setSubmitError("");
              }}
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

        {/* Submit Error */}
        {submitError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        )}

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