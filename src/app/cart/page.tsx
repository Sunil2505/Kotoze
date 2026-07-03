"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
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
  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">

        <h1 className="mb-2 text-5xl font-extrabold text-gray-900">
          Shopping Cart
        </h1>

        <p className="mb-8 text-gray-700">
          You have{" "}
          <span className="font-semibold">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </span>{" "}
          in your cart
        </p>


        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">

            <ShoppingBag
              size={60}
              className="mx-auto text-orange-500"
            />

            <h2 className="mt-5 text-3xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Cart Items */}
          <div className="lg:col-span-2">

            {cart.map((item) => (

              <div
                key={item.id}
                className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
              >

                <div className="flex flex-col gap-6 md:flex-row">

                  <div className="flex h-44 w-44 items-center justify-center rounded-xl bg-gray-100">

                    <Image
                      src={item.image}
                      alt={item.name}
                      width={180}
                      height={180}
                      className="object-contain"
                    />

                  </div>


                  <div className="flex-1">

                    <h2 className="text-3xl font-extrabold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      🟢 In Stock
                    </p>


                    <div className="mt-5">
                      <span className="text-3xl font-bold text-orange-500">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                                        <div className="mt-6 flex items-center gap-4">

                      {/* Quantity */}
                      <div className="flex items-center rounded-xl border">

                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-3 hover:bg-gray-100"
                        >
                          <Minus size={18} />
                        </button>

                        <span className="px-5 font-bold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="p-3 hover:bg-gray-100"
                        >
                          <Plus size={18} />
                        </button>

                      </div>


                      <button className="flex items-center gap-2 text-orange-500">
                        <Heart size={18} />
                        Save
                      </button>


                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-red-500"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}


            <Link
              href="/"
              className="mt-6 flex w-fit items-center gap-2 rounded-xl border-2 border-orange-500 bg-orange-50 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </Link>


          </div>


          {/* Order Summary */}

          <div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">

              <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
                Order Summary
              </h2>


              <div className="mb-4 flex justify-between text-lg text-gray-800">
                <span>Subtotal</span>

                <span>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>


              <div className="mb-4 flex justify-between text-lg text-gray-800">
                <span>Shipping</span>

                <span className="font-semibold text-green-600">
                  FREE
                </span>
              </div>


              <hr className="my-5" />


              <div className="flex justify-between text-3xl font-extrabold text-gray-900">

                <span>Total</span>

                <span>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>

              </div>


              <button className="mt-6 w-full rounded-xl bg-orange-500 py-4 text-lg font-bold text-white hover:bg-orange-600">
                Proceed to Checkout
              </button>


              <div className="mt-6 rounded-xl border border-green-300 bg-green-100 p-4">

                <div className="flex items-center gap-2 text-lg font-bold text-green-800">

                  <ShieldCheck size={20} />

                  Secure Checkout

                </div>


                <p className="mt-2 text-gray-700">
                  Your payment information is protected with SSL encryption.
                </p>

              </div>


            </div>

          </div>

        </div>

        )}

      </div>

    </main>
  );
}