"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  value: string;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  onChange: (value: string) => void;
  className?: string;
  contentClassName?: string;
}

export function Combobox({
  value,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No data found.",
  onChange,
  className,
  contentClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find(
    (item) => item.value === value
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        className={cn("w-full", className)}
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal h-10"
          >
            <span className="min-w-0 truncate">
              {selected?.label ?? placeholder}
            </span>

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      />

      <PopoverContent
        className={cn(
          "w-[var(--anchor-width)] p-0",
          contentClassName
        )}
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
          />

          <CommandList>
            <CommandEmpty>
              {emptyText}
            </CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="w-full"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  <span className="min-w-0 truncate">
                    {option.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}