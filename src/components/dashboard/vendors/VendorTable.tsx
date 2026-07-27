"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  Vendor,
  getVendors,
} from "@/lib/api/vendor";

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

    if (!keyword) return vendors;

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
      <div className="rounded-xl border bg-card p-8 text-center">
        Loading vendors...
      </div>
    );
  }  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor Code</TableHead>

            <TableHead>Business</TableHead>

            <TableHead>Contact Person</TableHead>

            <TableHead>Mobile</TableHead>

            <TableHead>Email</TableHead>

            <TableHead>Approval</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Created</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

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
              <TableCell className="font-medium">
                {vendor.vendorCode}
              </TableCell>

              <TableCell>
                <div className="font-medium">
                  {vendor.businessName}
                </div>

                {vendor.legalName && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {vendor.legalName}
                  </div>
                )}
              </TableCell>

              <TableCell>
                {vendor.contactPerson}
              </TableCell>

              <TableCell>
                {vendor.mobile}
              </TableCell>

              <TableCell>
                {vendor.email || "—"}
              </TableCell>

              <TableCell>
                {getApprovalBadge(
                  vendor.approvalStatus
                )}
              </TableCell>

              <TableCell>
                {getStatusBadge(vendor.status)}
              </TableCell>

              <TableCell>
                {new Date(
                  vendor.createdAt
                ).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(vendor)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete?.(vendor)}
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
  );
}