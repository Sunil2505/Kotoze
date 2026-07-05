"use client";

import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";

import { useRouter } from "next/navigation";

import {
  CreditCard,
  Truck,
  ArrowLeft,
  Wallet,
} from "lucide-react";


export default function CheckoutPage() {


  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();


  const { placeOrder } = useOrders();

  const router = useRouter();



  return (

    <main className="min-h-screen bg-gray-50 py-2">


      <div className="mx-auto max-w-5xl px-5">


        {/* Back */}

        <button
          onClick={() => router.back()}
          className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-orange-500 hover:text-white"
        >

          <ArrowLeft size={18} />

          Back

        </button>





        <h1 className="mb-3 text-2xl font-extrabold text-gray-900">

          Checkout

        </h1>






        <div className="grid gap-4 lg:grid-cols-3">





          {/* Shipping */}


          <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow">


            <div className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">

              <Truck size={20} />

              Shipping Details

            </div>






            <div className="grid gap-2.5">


              <input
                placeholder="Full Name"
                className="rounded-lg border px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
              />


              <input
                placeholder="Mobile Number"
                className="rounded-lg border px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
              />



              <textarea
                placeholder="Delivery Address"
                rows={2}
                className="rounded-lg border px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
              />





              <div className="grid gap-2.5 md:grid-cols-2">


                <input
                  placeholder="City"
                  className="rounded-lg border px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                />


                <input
                  placeholder="Pincode"
                  className="rounded-lg border px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                />


              </div>


            </div>







            {/* Payment */}


            <div className="mt-4">


              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900">

                <Wallet size={20} />

                Payment Method

              </h2>



              <div className="rounded-lg border bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600">

                💵 Cash On Delivery

              </div>


            </div>



          </div>








          {/* Summary */}


          <div className="rounded-xl bg-white p-4 shadow">



            <h2 className="mb-4 text-xl font-bold text-gray-900">

              Order Summary

            </h2>





            <div className="flex justify-between text-sm text-gray-800">

              <span>Items</span>

              <b>{cart.length}</b>

            </div>





            <hr className="my-3" />






            <div className="flex justify-between text-xl font-bold text-gray-900">

              <span>Total</span>

              <span>
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>

            </div>








            <button

              onClick={() => {


                placeOrder({

                  orderId:
                    "KTZ-" + Date.now(),

                  date:
                    new Date().toLocaleDateString(),

                  items: cart,

                  total: cartTotal,

                });



                clearCart();


                router.push("/order-success");


              }}


              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 font-bold text-white hover:bg-orange-600"

            >

              <CreditCard size={18} />

              Place Order

            </button>




          </div>



        </div>


      </div>


    </main>

  );

}