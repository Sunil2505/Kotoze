"use client";

import { use } from "react";
import { useOrders } from "@/context/OrderContext";
import Image from "next/image";

import {
  PackageCheck,
  Truck,
  Package,
  Home,
} from "lucide-react";


export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const { id } = use(params);


  const { orders } = useOrders();


  const order = orders.find(
    (item) => item.orderId === id
  );



  if (!order) {

    return (

      <main className="min-h-screen bg-gray-50 py-16">


        <h1 className="text-center text-3xl font-bold text-gray-900">

          Order Not Found

        </h1>


      </main>

    );

  }




  return (

    <main className="min-h-screen bg-gray-50 py-16">


      <div className="mx-auto max-w-5xl px-6">


        <h1 className="mb-8 text-3xl font-extrabold text-gray-900">

          Order Details

        </h1>





        <div className="rounded-2xl bg-white p-6 shadow-lg">


          {/* Order Info */}


          <div className="flex justify-between">


            <div>


              <p className="font-semibold text-gray-900">

                Order ID: {order.orderId}

              </p>


              <p className="mt-2 text-gray-600">

                Date: {order.date}

              </p>


            </div>



            <span className="font-semibold text-green-600">

              Confirmed

            </span>


          </div>





          {/* Products */}


          <div className="mt-10 space-y-6">


{order.items.map((item, index) => (


  <div

    key={`${item.id}-${index}`}

    className="flex items-center gap-6"

  >

                <Image

                  src={item.image}

                  alt={item.name}

                  width={130}

                  height={130}

                  className="object-contain"

                />



                <div>


                  <h2 className="text-xl font-bold text-gray-900">

                    {item.name}

                  </h2>



                  <p className="mt-2 text-gray-700">

                    Quantity: {item.quantity}

                  </p>



                  <p className="mt-2 font-bold text-orange-500">

                    ₹{item.price.toLocaleString("en-IN")}

                  </p>


                </div>



              </div>


            ))}


          </div>







          {/* Tracking */}


          <div className="mt-10 rounded-xl bg-gray-50 p-6">


            <h2 className="mb-6 text-xl font-bold text-gray-900">

              Track Order

            </h2>



            <div className="space-y-5">


              <div className="flex items-center gap-3 text-green-600">


                <PackageCheck />


                Order Confirmed


              </div>





              <div className="flex items-center gap-3 text-gray-500">


                <Package />


                Packed


              </div>





              <div className="flex items-center gap-3 text-gray-500">


                <Truck />


                Shipped


              </div>





              <div className="flex items-center gap-3 text-gray-500">


                <Home />


                Delivered


              </div>


            </div>


          </div>







          {/* Total */}


          <div className="mt-8 border-t pt-5 text-xl font-bold text-gray-900">


            Total: ₹{(order.total || 0).toLocaleString("en-IN")}


          </div>



        </div>


      </div>


    </main>

  );

}