"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

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
          <EmptyCart />
        ) : (

          <div className="grid gap-8 lg:grid-cols-3">


            {/* Cart Items */}
            <div className="lg:col-span-2">

              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}


              <Link
                href="/"
                className="mt-6 flex w-fit items-center gap-2 rounded-xl border-2 border-orange-500 bg-orange-50 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
              >
                <ShoppingBag size={20} />
                Continue Shopping
              </Link>

            </div>


            {/* Summary Component */}
            <CartSummary cartTotal={cartTotal} />


          </div>

        )}

      </div>
    </main>
  );
}