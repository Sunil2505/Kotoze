"use client";

import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BrandToolbarProps {
  search: string;
  onSearchChange(value: string): void;
  onAddBrand(): void;
}

export default function BrandToolbar({
  search,
  onSearchChange,
  onAddBrand,
}: BrandToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search brands..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Button onClick={onAddBrand}>
        <Plus className="mr-2 h-4 w-4" />
        Add Brand
      </Button>
    </div>
  );
}