import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">

          <div className="flex items-center gap-6 rounded-2xl border p-5 shadow-sm">
            <Image
              src="/images/products/headphones.jpg"
              alt="Headphones"
              width={120}
              height={120}
              className="rounded-xl"
            />

            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                Wireless Headphones
              </h2>

              <p className="mt-2 text-orange-500 font-bold">
                ₹2,499
              </p>

              <div className="mt-4 flex items-center gap-3">
                <button className="rounded-lg border p-2">
                  <Minus size={18} />
                </button>

                <span className="text-lg font-semibold">1</span>

                <button className="rounded-lg border p-2">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button className="text-red-500 hover:text-red-700">
              <Trash2 />
            </button>

          </div>

        </div>

        {/* Order Summary */}
        <div className="rounded-2xl border p-6 shadow-sm h-fit">
          <h2 className="mb-6 text-2xl font-bold">
            Order Summary
          </h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹2,499</span>
          </div>

          <div className="mt-3 flex justify-between">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹2,499</span>
          </div>

          <button className="mt-6 w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
}