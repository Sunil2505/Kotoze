"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";


export default function CartPage() {


  const router = useRouter();


  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();



  return (

    <main className="min-h-screen bg-gray-50 py-3">


      <div className="mx-auto max-w-6xl px-6">


        {/* Back Button */}

        <button

          onClick={() => router.back()}

          className="mb-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow transition hover:bg-orange-500 hover:text-white"

        >

          <ArrowLeft size={18} />

          Back

        </button>





        <h1 className="mb-1 text-3xl font-extrabold text-gray-900">

          Shopping Cart

        </h1>




        <p className="mb-5 text-sm text-gray-700">

          You have{" "}

          <span className="font-semibold">

            {cartCount} {cartCount === 1 ? "item" : "items"}

          </span>{" "}

          in your cart

        </p>





        {cart.length === 0 ? (

          <EmptyCart />

        ) : (



          <div className="grid gap-5 lg:grid-cols-3">



            {/* Cart Items */}

            <div className="lg:col-span-2">



              {cart.map((item, index) => (


                <CartItem

                  key={`${item.id}-${index}`}

                  item={item}

                  increaseQuantity={increaseQuantity}

                  decreaseQuantity={decreaseQuantity}

                  removeFromCart={removeFromCart}

                />


              ))}






              <Link

                href="/"

                className="mt-4 flex w-fit items-center gap-2 rounded-xl border-2 border-orange-500 bg-orange-50 px-5 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"

              >

                <ShoppingBag size={18} />

                Continue Shopping


              </Link>



            </div>






            {/* Summary */}

            <CartSummary cartTotal={cartTotal} />



          </div>


        )}



      </div>


    </main>

  );

} 