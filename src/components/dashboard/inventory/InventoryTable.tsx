"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  Inventory,
  getInventories,
} from "@/lib/api/inventory";

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
  onEdit?: (inventory: Inventory) => void;
  onDelete?: (inventory: Inventory) => void;
}

export default function InventoryTable({
  search,
  refresh,
  onEdit,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(true);

  const [inventories, setInventories] = useState<
    Inventory[]
  >([]);

  async function loadInventories() {
    try {
      setLoading(true);

      const data = await getInventories();

      setInventories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventories();
  }, [refresh]);

  const filteredInventories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return inventories;

    return inventories.filter((inventory) => {
      const product =
        typeof inventory.productId === "object"
          ? inventory.productId.name
          : "";

      const sku =
        typeof inventory.productId === "object"
          ? inventory.productId.sku
          : "";

      return (
        product.toLowerCase().includes(keyword) ||
        sku.toLowerCase().includes(keyword)
      );
    });
  }, [inventories, search]);

  function getStatusBadge(
    status: Inventory["status"]
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

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>

            <TableHead>Product</TableHead>

            <TableHead>
              Available
            </TableHead>

            <TableHead>
              Reserved
            </TableHead>

            <TableHead>
              Minimum
            </TableHead>

            <TableHead>
              Reorder
            </TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Updated</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredInventories.length ===
            0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="py-10 text-center text-muted-foreground"
              >
                No inventory found.
              </TableCell>
            </TableRow>
          )}

          {filteredInventories.map(
            (inventory) => (
              <TableRow key={inventory._id}>
                <TableCell className="font-medium">
                  {typeof inventory.productId ===
                  "object"
                    ? inventory.productId.sku
                    : "-"}
                </TableCell>

                <TableCell>
                  {typeof inventory.productId ===
                  "object"
                    ? inventory.productId.name
                    : "-"}
                </TableCell>

                <TableCell>
                  {
                    inventory.availableStock
                  }
                </TableCell>

                <TableCell>
                  {
                    inventory.reservedStock
                  }
                </TableCell>

                <TableCell>
                  {
                    inventory.minimumStock
                  }
                </TableCell>

                <TableCell>
                  {
                    inventory.reorderLevel
                  }
                </TableCell>

                <TableCell>
                  {getStatusBadge(
                    inventory.status
                  )}
                </TableCell>

                <TableCell>
                  {new Date(
                    inventory.updatedAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onEdit?.(inventory)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        onDelete?.(
                          inventory
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}