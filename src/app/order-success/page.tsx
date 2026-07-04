import Link from "next/link";
import { CheckCircle } from "lucide-react";


export default function OrderSuccessPage() {

  return (

    <main className="min-h-screen bg-gray-50 py-12">

      <div className="mx-auto max-w-xl px-6">


        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">


          <CheckCircle
            size={55}
            className="mx-auto text-green-500"
          />


          <h1 className="mt-5 text-3xl font-extrabold text-gray-900">

            Order Placed Successfully!

          </h1>


          <p className="mt-4 text-lg text-gray-600">

            Thank you for shopping with Kotoze.
            Your order has been received.

          </p>



          {/* Buttons */}

          <div className="mt-8 flex flex-wrap justify-center gap-4">


            <Link
              href="/orders"
              className="rounded-xl bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-600"
            >

              View My Orders

            </Link>



            <Link
              href="/"
              className="rounded-xl border border-orange-500 px-8 py-4 font-bold text-orange-500 transition hover:bg-orange-50"
            >

              Continue Shopping

            </Link>


          </div>



        </div>


      </div>


    </main>

  );

}