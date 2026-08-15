"use client";

import { useEffect, useState } from "react";

import {
  Product,
  getProducts,
} from "@/lib/api/product";

import {
  StockInData,
  stockIn,
} from "@/lib/api/inventory";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function StockInDialog({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [productId, setProductId] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [
    referenceType,
    setReferenceType,
  ] = useState<
    | "INITIAL_STOCK"
    | "PURCHASE"
    | "PURCHASE_RETURN"
    | "CUSTOMER_RETURN"
    | "ADJUSTMENT"
    | "OTHER"
  >("PURCHASE");

  const [
    referenceNumber,
    setReferenceNumber,
  ] = useState("");

  const [remarks, setRemarks] =
    useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data =
          await getProducts();

        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (open) {
      loadProducts();
    }
  }, [open]);

  async function handleSubmit() {
    try {
      setLoading(true);

      if (!productId) {
        throw new Error(
          "Please select a product."
        );
      }

      if (quantity <= 0) {
        throw new Error(
          "Quantity must be greater than zero."
        );
      }

      const payload: StockInData = {
        productId,
        quantity,
        transactionType: "STOCK_IN",
        referenceType,
        referenceNumber:
          referenceNumber || undefined,
        remarks:
          remarks || undefined,
      };

      await stockIn(payload);

      setProductId("");
      setQuantity(1);

      setReferenceType(
        "PURCHASE"
      );

      setReferenceNumber("");

      setRemarks("");

      onSuccess();

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Stock In failed."
      );
    } finally {
      setLoading(false);
    }
  }
    return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Stock In
          </DialogTitle>

          <DialogDescription>
            Add stock to inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product
            </label>

                <Select
                value={productId}
                onValueChange={(value) =>
                    setProductId(value ?? "")
                }
                >
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>

              <SelectContent>
                {products.map((product) => (
                  <SelectItem
                    key={product._id}
                    value={product._id}
                  >
                    {product.sku} - {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Quantity
            </label>

            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Reference Type
            </label>

            <Select
              value={referenceType}
                onValueChange={(value) =>
                setReferenceType(
                    (value ?? "PURCHASE") as
                    | "INITIAL_STOCK"
                    | "PURCHASE"
                    | "PURCHASE_RETURN"
                    | "CUSTOMER_RETURN"
                    | "ADJUSTMENT"
                    | "OTHER"
                )
                }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="INITIAL_STOCK">
                  Initial Stock
                </SelectItem>

                <SelectItem value="PURCHASE">
                  Purchase
                </SelectItem>

                <SelectItem value="PURCHASE_RETURN">
                  Purchase Return
                </SelectItem>

                <SelectItem value="CUSTOMER_RETURN">
                  Customer Return
                </SelectItem>

                <SelectItem value="ADJUSTMENT">
                  Adjustment
                </SelectItem>

                <SelectItem value="OTHER">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Reference Number
            </label>

            <Input
              value={referenceNumber}
              onChange={(e) =>
                setReferenceNumber(
                  e.target.value
                )
              }
              placeholder="PO-1001"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Remarks
            </label>

            <textarea
              rows={4}
              value={remarks}
              onChange={(e) =>
                setRemarks(
                  e.target.value
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Remarks..."
            />
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
              !productId ||
              quantity <= 0
            }
          >
            {loading
              ? "Saving..."
              : "Stock In"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}