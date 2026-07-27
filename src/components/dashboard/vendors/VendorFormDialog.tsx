"use client";

import { useEffect, useState } from "react";

import {
  Vendor,
  VendorFormData,
  createVendor,
  updateVendor,
} from "@/lib/api/vendor";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export default function VendorFormDialog({
  open,
  onOpenChange,
  vendor,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] =
    useState("");

  const [legalName, setLegalName] =
    useState("");

  const [contactPerson, setContactPerson] =
    useState("");

  const [email, setEmail] = useState("");

  const [mobile, setMobile] = useState("");

  const [gstNumber, setGstNumber] =
    useState("");

  const [panNumber, setPanNumber] =
    useState("");

  const [status, setStatus] = useState<
    "ACTIVE" | "INACTIVE" | "BLOCKED"
  >("ACTIVE");

  const [approvalStatus, setApprovalStatus] =
    useState<
      "PENDING" | "APPROVED" | "REJECTED"
    >("PENDING");

  useEffect(() => {
    if (vendor) {
      setBusinessName(vendor.businessName);
      setLegalName(vendor.legalName ?? "");
      setContactPerson(vendor.contactPerson);
      setEmail(vendor.email ?? "");
      setMobile(vendor.mobile);
      setGstNumber(vendor.gstNumber ?? "");
      setPanNumber(vendor.panNumber ?? "");
      setStatus(vendor.status);
      setApprovalStatus(vendor.approvalStatus);
    } else {
      setBusinessName("");
      setLegalName("");
      setContactPerson("");
      setEmail("");
      setMobile("");
      setGstNumber("");
      setPanNumber("");
      setStatus("ACTIVE");
      setApprovalStatus("PENDING");
    }
  }, [vendor, open]);

  async function handleSubmit() {
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
        await createVendor(payload);
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
  }  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>
            {vendor ? "Edit Vendor" : "Add Vendor"}
          </DialogTitle>

          <DialogDescription>
            {vendor
              ? "Update vendor information."
              : "Create a new vendor."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pb-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Business Name
            </label>

            <Input
              value={businessName}
              onChange={(e) =>
                setBusinessName(e.target.value)
              }
              placeholder="Enter business name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Legal Name
            </label>

            <Input
              value={legalName}
              onChange={(e) =>
                setLegalName(e.target.value)
              }
              placeholder="Enter legal name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Contact Person
            </label>

            <Input
              value={contactPerson}
              onChange={(e) =>
                setContactPerson(e.target.value)
              }
              placeholder="Enter contact person"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Mobile
            </label>

            <Input
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
              placeholder="Enter mobile number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <Input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              GST Number
            </label>

            <Input
              value={gstNumber}
              onChange={(e) =>
                setGstNumber(e.target.value)
              }
              placeholder="Enter GST number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              PAN Number
            </label>

            <Input
              value={panNumber}
              onChange={(e) =>
                setPanNumber(e.target.value)
              }
              placeholder="Enter PAN number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as VendorFormData["status"]
                )    
            }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Approval Status
            </label>

            <select
              value={approvalStatus}
              onChange={(e) =>
                setApprovalStatus(
                  e.target.value as VendorFormData["approvalStatus"]
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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

        <DialogFooter>
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
            disabled={
              loading ||
              businessName.trim().length === 0 ||
              contactPerson.trim().length === 0 ||
              mobile.trim().length === 0
            }
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