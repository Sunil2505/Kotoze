import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-lg">

      <ShoppingBag
        size={60}
        className="mx-auto text-orange-500"
      />

      <h2 className="mt-5 text-3xl font-bold text-gray-900">
        Your cart is empty
      </h2>

      <p className="mt-3 text-gray-600">
        Looks like you haven't added anything yet.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        Continue Shopping
      </Link>

    </div>
  );
}