"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useOrders } from "@/context/OrderContext";

import {
  PackageCheck,
  Truck,
  Package,
  Home,
  ArrowLeft,
} from "lucide-react";


export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const { id } = use(params);

  const router = useRouter();

  const { orders } = useOrders();


  const order = orders.find(
    (item) => item.orderId === id
  );



  if (!order) {

    return (

      <main className="min-h-screen bg-gray-50 p-4">

        <button
          onClick={() => router.back()}
          className="rounded-full bg-white px-4 py-2 shadow"
        >
          <ArrowLeft size={18} />
        </button>


        <h1 className="mt-10 text-center text-2xl font-bold">

          Order Not Found

        </h1>

      </main>

    );

  }




  return (

    <main className="min-h-screen bg-gray-50 py-2">


      <div className="mx-auto max-w-4xl px-4">



        <button

          onClick={() => router.back()}

          className="mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow hover:bg-orange-500 hover:text-white"

        >

          <ArrowLeft size={17} />

          Back

        </button>





        <h1 className="mb-3 text-2xl font-bold text-gray-900">

          Order Details

        </h1>





        <div className="grid gap-4 lg:grid-cols-3">





          {/* LEFT */}

          <div className="h-fit lg:col-span-2 rounded-xl bg-white p-4 shadow">



            <div className="flex justify-between text-sm">


              <div>

                <p className="font-bold">

                  Order ID: {order.orderId}

                </p>


                <p className="text-gray-500">

                  {order.date}

                </p>

              </div>


              <span className="font-bold text-green-600">

                Confirmed

              </span>


            </div>





            <div className="mt-4 space-y-3">


              {order.items.map((item, index) => (

                <div

                  key={`${item.id}-${index}`}

                  className="flex items-center gap-3 rounded-xl border p-3"

                >


                  <Image

                    src={item.image}

                    alt={item.name}

                    width={65}

                    height={65}

                    className="object-contain"

                  />



                  <div>


                    <h2 className="font-bold text-gray-900">

                      {item.name}

                    </h2>


                    <p className="text-sm">

                      Qty: {item.quantity}

                    </p>


                    <p className="font-bold text-orange-500">

                      ₹{item.price.toLocaleString("en-IN")}

                    </p>


                  </div>


                </div>


              ))}


            </div>



          </div>









          {/* RIGHT */}


          <div className="h-fit rounded-xl bg-white p-4 shadow">


            <h2 className="mb-4 font-bold">

              Track Order

            </h2>



            <div className="space-y-3 text-sm">


              <p className="flex gap-2 text-green-600">

                <PackageCheck size={17} />

                Confirmed

              </p>


              <p className="flex gap-2 text-gray-500">

                <Package size={17} />

                Packed

              </p>


              <p className="flex gap-2 text-gray-500">

                <Truck size={17} />

                Shipped

              </p>


              <p className="flex gap-2 text-gray-500">

                <Home size={17} />

                Delivered

              </p>


            </div>





{/* Payment Details */}

<div className="mt-5 rounded-xl bg-orange-50 p-3">


  <h2 className="mb-3 font-bold text-gray-900">

    Payment Details

  </h2>



  <div className="space-y-2 text-sm">


    <div className="flex justify-between text-gray-700">

      <span>Method</span>

      <span className="font-bold">

        Cash On Delivery

      </span>

    </div>



    <div className="flex justify-between text-gray-700">

      <span>Payment Status</span>

      <span className="font-bold text-orange-600">

        Pending

      </span>

    </div>


  </div>


</div>





{/* Total */}

        <div className="mt-5 border-t pt-4 text-xl font-bold text-gray-900">

          Total

          <br />

          ₹{(order.total || 0).toLocaleString("en-IN")}

        </div>



          </div>



        </div>


      </div>


    </main>

  );

}