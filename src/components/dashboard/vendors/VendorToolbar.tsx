"use client";

import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VendorToolbarProps {
  search: string;
  onSearchChange(value: string): void;
  onAddVendor(): void;
}

export default function VendorToolbar({
  search,
  onSearchChange,
  onAddVendor,
}: VendorToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Button
        onClick={onAddVendor}
        className="whitespace-nowrap"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Vendor
      </Button>
    </div>
  );
}