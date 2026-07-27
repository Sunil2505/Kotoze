"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  Category,
  getCategories,
} from "@/lib/api/category";

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
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export default function CategoryTable({
  search,
  refresh,
  onEdit,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);

  async function loadCategories() {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, [refresh]);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return categories;

    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(keyword) ||
        category.slug.toLowerCase().includes(keyword) ||
        (category.description ?? "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [categories, search]);

  function getStatusBadge(
    status: Category["status"]
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
        Loading categories...
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

            <TableHead>Status</TableHead>

            <TableHead>Sort Order</TableHead>

            <TableHead>Created</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {filteredCategories.length === 0 && (
            <TableRow>

              <TableCell
                colSpan={6}
                className="py-10 text-center text-muted-foreground"
              >
                No categories found.
              </TableCell>

            </TableRow>
          )}

          {filteredCategories.map((category) => (
            <TableRow key={category._id}>

              <TableCell>

                <div className="font-medium">
                  {category.name}
                </div>

                {category.description && (
                  <div className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                    {category.description}
                  </div>
                )}

              </TableCell>

              <TableCell>

                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {category.slug}
                </code>

              </TableCell>

              <TableCell>
                {getStatusBadge(category.status)}
              </TableCell>

              <TableCell>
                {category.sortOrder}
              </TableCell>

              <TableCell>
                {new Date(
                  category.createdAt
                ).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right">

                <div className="flex justify-end gap-2">
                                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete?.(category)}
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