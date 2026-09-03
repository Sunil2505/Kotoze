"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  Vendor,
  getVendors,
} from "@/lib/api/vendor";

import {
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  search: string;
  refresh?: number;
  onEdit?: (vendor: Vendor) => void;
  onDelete?: (vendor: Vendor) => void;
}

function formatMobile(mobile: string): string {
  const value = mobile.trim();

  if (!value) {
    return "—";
  }

  if (/^\d{10}$/.test(value)) {
    return `+91 ${value}`;
  }

  if (value.startsWith("+")) {
    const digits = value.slice(1);

    const callingCodes = Array.from(
      new Set(
        getCountries().map((country) =>
          getCountryCallingCode(country)
        )
      )
    ).sort(
      (a, b) => b.length - a.length
    );

    const matchedCallingCode =
      callingCodes.find((code) =>
        digits.startsWith(code)
      );

    if (matchedCallingCode) {
      return `+${matchedCallingCode} ${digits.slice(
        matchedCallingCode.length
      )}`;
    }
  }

  return value;
}

export default function VendorTable({
  search,
  refresh,
  onEdit,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  async function loadVendors() {
    try {
      setLoading(true);

      const data = await getVendors();
      setVendors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVendors();
  }, [refresh]);

  const filteredVendors = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return vendors;
    }

    return vendors.filter((vendor) => {
      return (
        vendor.vendorCode
          .toLowerCase()
          .includes(keyword) ||
        vendor.businessName
          .toLowerCase()
          .includes(keyword) ||
        vendor.contactPerson
          .toLowerCase()
          .includes(keyword) ||
        vendor.mobile
          .toLowerCase()
          .includes(keyword) ||
        (vendor.email ?? "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [vendors, search]);

  function getStatusBadge(
    status: Vendor["status"]
  ) {
    switch (status) {
      case "ACTIVE":
        return <Badge>Active</Badge>;

      case "INACTIVE":
        return (
          <Badge variant="secondary">
            Inactive
          </Badge>
        );

      case "BLOCKED":
        return (
          <Badge variant="destructive">
            Blocked
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
    }
  }

  function getApprovalBadge(
    status: Vendor["approvalStatus"]
  ) {
    switch (status) {
      case "APPROVED":
        return <Badge>Approved</Badge>;

      case "PENDING":
        return (
          <Badge variant="secondary">
            Pending
          </Badge>
        );

      case "REJECTED":
        return (
          <Badge variant="destructive">
            Rejected
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            Unknown
          </Badge>
        );
    }
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center rounded-xl border bg-card">
        Loading vendors...
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border bg-card">

      {/* =========================
          FIXED TABLE HEADER
      ========================== */}
      <div className="shrink-0 overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[9%]">
                Vendor Code
              </TableHead>

              <TableHead className="w-[16%]">
                Business
              </TableHead>

              <TableHead className="w-[11%]">
                Contact Person
              </TableHead>

              <TableHead className="w-[13%]">
                Mobile
              </TableHead>

              <TableHead className="w-[16%]">
                Email
              </TableHead>

              <TableHead className="w-[9%]">
                Approval
              </TableHead>

              <TableHead className="w-[8%]">
                Status
              </TableHead>

              <TableHead className="w-[10%]">
                Created
              </TableHead>

              <TableHead className="w-[8%] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* =========================
          SCROLLABLE TABLE BODY
      ========================== */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <Table className="w-full table-fixed">
          <TableBody>
            {filteredVendors.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-muted-foreground"
                >
                  No vendors found.
                </TableCell>
              </TableRow>
            )}

            {filteredVendors.map((vendor) => (
              <TableRow key={vendor._id}>

                {/* Vendor Code */}
                <TableCell className="whitespace-nowrap font-medium">
                  {vendor.vendorCode}
                </TableCell>

                {/* Business */}
                <TableCell className="overflow-hidden">
                  <div className="truncate font-medium">
                    {vendor.businessName}
                  </div>

                  {vendor.legalName && (
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                      {vendor.legalName}
                    </div>
                  )}
                </TableCell>

                {/* Contact Person */}
                <TableCell className="overflow-hidden">
                  <div className="truncate">
                    {vendor.contactPerson}
                  </div>
                </TableCell>

                {/* Mobile */}
                <TableCell className="whitespace-nowrap">
                  {formatMobile(vendor.mobile)}
                </TableCell>

                {/* Email */}
                <TableCell className="overflow-hidden">
                  <div className="truncate">
                    {vendor.email || "—"}
                  </div>
                </TableCell>

                {/* Approval */}
                <TableCell className="whitespace-nowrap">
                  {getApprovalBadge(
                    vendor.approvalStatus
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="whitespace-nowrap">
                  {getStatusBadge(
                    vendor.status
                  )}
                </TableCell>

                {/* Created */}
                <TableCell className="whitespace-nowrap">
                  {new Date(
                    vendor.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onEdit?.(vendor)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        onDelete?.(vendor)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* =========================
          FOOTER
      ========================== */}
      <div className="shrink-0 border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredVendors.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {vendors.length}
          </span>{" "}
          vendors
        </p>
      </div>

    </div>
  );
}