import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        <p className="mb-8 text-gray-500">
          You have <span className="font-semibold">1 item</span> in your cart
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Item */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-6 md:flex-row">

                <div className="flex h-44 w-44 items-center justify-center rounded-xl bg-gray-100">
                  <Image
                    src="/images/products/headphones.jpg"
                    alt="Wireless Headphones"
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">

                  <h2 className="text-2xl font-bold">
                    Wireless Headphones
                  </h2>

                  <p className="mt-1 text-gray-500">
                    Sony Premium Series
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    ⭐⭐⭐⭐⭐
                    <span className="text-gray-500">(124 Reviews)</span>
                  </div>

                  <p className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    🟢 In Stock
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-3xl font-bold text-orange-500">
                      ₹2,499
                    </span>

                    <span className="text-lg text-gray-400 line-through">
                      ₹3,199
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-4">

                    <div className="flex items-center rounded-xl border">

                      <button className="p-3 hover:bg-gray-100">
                        <Minus size={18} />
                      </button>

                      <span className="px-5 font-bold">
                        1
                      </span>

                      <button className="p-3 hover:bg-gray-100">
                        <Plus size={18} />
                      </button>

                    </div>

                    <button className="flex items-center gap-2 text-orange-500 hover:text-orange-600">
                      <Heart size={18} />
                      Save
                    </button>

                    <button className="flex items-center gap-2 text-red-500 hover:text-red-600">
                      <Trash2 size={18} />
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* Continue Shopping */}

            <button className="mt-6 flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-semibold hover:border-orange-500 hover:text-orange-500">
              <ShoppingBag size={20} />
              Continue Shopping
            </button>

          </div>

          {/* Summary */}

          <div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-2xl font-bold">
                Order Summary
              </h2>

              <div className="mb-3 flex justify-between">
                <span>Subtotal</span>
                <span>₹2,499</span>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">
                  FREE
                </span>
              </div>

              <div className="mb-3 flex justify-between">
                <span>Discount</span>
                <span className="text-orange-500">
                  - ₹700
                </span>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>₹2,499</span>
              </div>

              <button className="mt-6 w-full rounded-xl bg-orange-500 py-4 font-bold text-white transition hover:bg-orange-600">
                Proceed to Checkout
              </button>

              <div className="mt-6 rounded-xl bg-green-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-green-700">
                  <ShieldCheck size={20} />
                  Secure Checkout
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  Your payment information is protected with SSL encryption.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}