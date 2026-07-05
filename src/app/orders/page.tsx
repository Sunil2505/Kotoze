"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  PackageCheck,
  ArrowLeft,
} from "lucide-react";

import { useOrders } from "@/context/OrderContext";


export default function OrdersPage() {


  const router = useRouter();

  const { orders } = useOrders();




  if (orders.length === 0) {

    return (

      <main className="min-h-screen bg-gray-50 py-3">

        <div className="mx-auto max-w-5xl px-6">


          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-orange-500 hover:text-white"
          >

            <ArrowLeft size={18} />

            Back

          </button>




          <div className="text-center">

            <PackageCheck
              size={55}
              className="mx-auto text-orange-500"
            />


            <h1 className="mt-4 text-2xl font-bold text-gray-900">

              No Orders Yet

            </h1>


            <p className="mt-2 text-gray-600">

              Your purchased items will appear here.

            </p>


          </div>


        </div>

      </main>

    );

  }







  return (

    <main className="min-h-screen bg-gray-50 py-3">


      <div className="mx-auto max-w-5xl px-6">


        {/* Back */}

        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-orange-500 hover:text-white"
        >

          <ArrowLeft size={18} />

          Back

        </button>






        <h1 className="mb-5 text-2xl font-extrabold text-gray-900">

          My Orders

        </h1>





        <div className="space-y-4">


          {orders.map((order) => (


            <div
              key={order.orderId}
              className="rounded-2xl bg-white p-4 shadow"
            >




              <div className="mb-4 flex justify-between text-sm text-gray-700">

                <span>
                  Order ID: {order.orderId}
                </span>


                <span>
                  {order.date}
                </span>

              </div>







              {order.items.map((item, index) => (


                <div
                  key={`${item.id}-${index}`}
                  className="flex gap-4"
                >



                  <Image

                    src={item.image}

                    alt={item.name}

                    width={90}

                    height={90}

                    className="object-contain"

                  />





                  <div className="flex-1">


                    <h2 className="text-lg font-bold text-gray-900">

                      {item.name}

                    </h2>




                    <p className="mt-1 text-sm text-gray-600">

                      Quantity: {item.quantity}

                    </p>




                    <p className="mt-1 font-bold text-orange-500">

                      ₹{item.price.toLocaleString("en-IN")}

                    </p>





                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">

                      <PackageCheck size={16} />

                      Order Confirmed

                    </div>



                  </div>


                </div>


              ))}







              <div className="mt-4 flex items-center justify-between border-t pt-3">


                <Link

                  href={`/orders/${order.orderId}`}

                  className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600"

                >

                  View Details

                </Link>





                <div className="font-bold text-gray-900">

                  Total: ₹{(order.total ?? 0).toLocaleString("en-IN")}

                </div>


              </div>



            </div>


          ))}


        </div>


      </div>


    </main>

  );

}