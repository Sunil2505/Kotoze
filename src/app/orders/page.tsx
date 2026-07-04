"use client";

import Image from "next/image";
import Link from "next/link";

import { PackageCheck } from "lucide-react";
import { useOrders } from "@/context/OrderContext";


export default function OrdersPage() {

  const { orders } = useOrders();


  if (orders.length === 0) {

    return (

      <main className="min-h-screen bg-gray-50 py-12">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <PackageCheck
            size={70}
            className="mx-auto text-orange-500"
          />

          <h1 className="mt-5 text-3xl font-bold text-gray-900">

            No Orders Yet

          </h1>


          <p className="mt-3 text-gray-600">

            Your purchased items will appear here.

          </p>

        </div>

      </main>

    );

  }



  return (

    <main className="min-h-screen bg-gray-50 py-12">


      <div className="mx-auto max-w-5xl px-6">


        <h1 className="mb-8 text-3xl font-extrabold text-gray-900">

          My Orders

        </h1>



        <div className="space-y-6">


          {orders.map((order) => (


            <div
              key={order.orderId}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >



              <div className="mb-5 flex justify-between text-gray-700">


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
                    className="flex gap-6"
                  >


                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="object-contain"
                  />



                  <div className="flex-1">


                    <h2 className="text-xl font-bold text-gray-900">

                      {item.name}

                    </h2>



                    <p className="mt-2 text-gray-600">

                      Quantity: {item.quantity}

                    </p>



                    <p className="mt-2 font-bold text-orange-500">

                      ₹{item.price.toLocaleString("en-IN")}

                    </p>



                    <div className="mt-3 flex items-center gap-2 text-green-600">

                      <PackageCheck size={18} />

                      Order Confirmed

                    </div>


                  </div>


                </div>


              ))}





              <div className="mt-5 flex items-center justify-between border-t pt-4">


                <Link

                  href={`/orders/${order.orderId}`}

                  className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"

                >

                  View Details

                </Link>



                <div className="text-xl font-bold text-gray-900">

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