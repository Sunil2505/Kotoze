"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  CheckCircle,
  ArrowLeft,
} from "lucide-react";


export default function OrderSuccessPage() {


  const router = useRouter();



  return (

    <main className="min-h-screen bg-gray-50 py-3">


      <div className="mx-auto max-w-xl px-6">



        {/* Back Button */}

        <button

          onClick={() => router.back()}

          className="mb-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow transition hover:bg-orange-500 hover:text-white"

        >

          <ArrowLeft size={18} />

          Back

        </button>





        <div className="rounded-2xl bg-white p-6 text-center shadow">


          <CheckCircle

            size={50}

            className="mx-auto text-green-500"

          />




          <h1 className="mt-4 text-2xl font-extrabold text-gray-900">

            Order Placed Successfully!

          </h1>





          <p className="mt-3 text-gray-600">

            Thank you for shopping with Kotoze.
            Your order has been received.

          </p>








          {/* Buttons */}

          <div className="mt-6 flex flex-wrap justify-center gap-3">



            <Link

              href="/orders"

              className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"

            >

              View My Orders

            </Link>






            <Link

              href="/"

              className="rounded-xl border border-orange-500 px-6 py-3 font-bold text-orange-500 transition hover:bg-orange-50"

            >

              Continue Shopping

            </Link>



          </div>




        </div>



      </div>


    </main>

  );

}