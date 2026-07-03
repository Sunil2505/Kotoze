import { ShieldCheck } from "lucide-react";

type Props = {
  cartTotal: number;
};

export default function CartSummary({ cartTotal }: Props) {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">

        <h2 className="mb-6 text-3xl font-extrabold text-gray-900">
          Order Summary
        </h2>

        <div className="mb-4 flex justify-between text-lg text-gray-800">
          <span>Subtotal</span>

          <span>
            ₹{cartTotal.toLocaleString("en-IN")}
          </span>
        </div>


        <div className="mb-4 flex justify-between text-lg text-gray-800">
          <span>Shipping</span>

          <span className="font-semibold text-green-600">
            FREE
          </span>
        </div>


        <hr className="my-5" />


        <div className="flex justify-between text-3xl font-extrabold text-gray-900">

          <span>Total</span>

          <span>
            ₹{cartTotal.toLocaleString("en-IN")}
          </span>

        </div>


        <button className="mt-6 w-full rounded-xl bg-orange-500 py-4 text-lg font-bold text-white hover:bg-orange-600">
          Proceed to Checkout
        </button>


        <div className="mt-6 rounded-xl border border-green-300 bg-green-100 p-4">

          <div className="flex items-center gap-2 text-lg font-bold text-green-800">

            <ShieldCheck size={20} />

            Secure Checkout

          </div>


          <p className="mt-2 text-gray-700">
            Your payment information is protected with SSL encryption.
          </p>

        </div>

      </div>
    </div>
  );
}