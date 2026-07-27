"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  Brand,
  getBrands,
} from "@/lib/api/brand";

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
  onEdit?: (brand: Brand) => void;
  onDelete?: (brand: Brand) => void;
}

export default function BrandTable({
  search,
  refresh,
  onEdit,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState<Brand[]>([]);

  async function loadBrands() {
    try {
      setLoading(true);

      const data = await getBrands();

      setBrands(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBrands();
  }, [refresh]);

  const filteredBrands = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return brands;
    }

    return brands.filter((brand) => {
      return (
        brand.name
          .toLowerCase()
          .includes(keyword) ||

        brand.slug
          .toLowerCase()
          .includes(keyword) ||

        (brand.website ?? "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [brands, search]);

  function getStatusBadge(
    status: Brand["status"]
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
        Loading brands...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
                <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>

            <TableHead>Slug</TableHead>

            <TableHead>Website</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Created</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredBrands.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-10 text-center text-muted-foreground"
              >
                No brands found.
              </TableCell>
            </TableRow>
          )}

          {filteredBrands.map((brand) => (
            <TableRow key={brand._id}>
              <TableCell>
                <div className="font-medium">
                  {brand.name}
                </div>
              </TableCell>

              <TableCell>
                <span className="text-muted-foreground">
                  {brand.slug}
                </span>
              </TableCell>

              <TableCell>
                {brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {brand.website}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>

              <TableCell>
                {getStatusBadge(brand.status)}
              </TableCell>

              <TableCell>
                {new Date(
                  brand.createdAt
                ).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onEdit?.(brand)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      onDelete?.(brand)
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
  );
}