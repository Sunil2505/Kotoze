"use client";

import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";

import { useRouter } from "next/navigation";

import { CreditCard, Truck } from "lucide-react";


export default function CheckoutPage() {


  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();


  const { placeOrder } = useOrders();


  const router = useRouter();



  return (

    <main className="min-h-screen bg-gray-50 py-12">


      <div className="mx-auto max-w-7xl px-6">


        <h1 className="mb-8 text-4xl font-extrabold text-gray-900">

          Checkout

        </h1>



        <div className="grid gap-8 lg:grid-cols-3">



          {/* Shipping Details */}


          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-lg">


            <div className="mb-5 flex items-center gap-2 text-2xl font-bold text-gray-900">

              <Truck />

              Shipping Details

            </div>




            <div className="grid gap-4">


              <input
                placeholder="Full Name"
                className="rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
              />


              <input
                placeholder="Mobile Number"
                className="rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
              />


              <textarea
                placeholder="Delivery Address"
                className="rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
              />


              <input
                placeholder="Pincode"
                className="rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
              />


            </div>


          </div>





          {/* Order Summary */}


          <div className="rounded-2xl bg-white p-6 shadow-lg">


            <h2 className="mb-5 text-2xl font-bold text-gray-900">

              Order Summary

            </h2>




            <div className="flex justify-between text-lg text-gray-800">

              <span>Total</span>


              <b>

                ₹{cartTotal.toLocaleString("en-IN")}

              </b>


            </div>




            <button

              onClick={() => {


                placeOrder({

                  orderId:
                    "KTZ-" + Date.now(),

                  date:
                    new Date()
                      .toLocaleDateString(),

                  items: cart,

                  total: cartTotal,

                });

                clearCart();


                router.push(
                  "/order-success"
                );


              }}


              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600"
            >


              <CreditCard />


              Place Order


            </button>



          </div>


        </div>


      </div>


    </main>

  );

}