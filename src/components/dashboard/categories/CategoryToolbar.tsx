"use client";

import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CategoryToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddCategory: () => void;
}

export default function CategoryToolbar({
  search,
  onSearchChange,
  onAddCategory,
}: CategoryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:max-w-md">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          value={search}
          placeholder="Search categories..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />

      </div>

      <Button
        onClick={onAddCategory}
        className="whitespace-nowrap"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Category
      </Button>

    </div>
  );
}