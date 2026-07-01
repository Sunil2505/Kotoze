import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";

export default function ProductDetails() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-2">

        {/* Product Image */}
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <Image
            src="/images/products/headphones.jpg"
            alt="Wireless Headphones"
            width={500}
            height={500}
            className="mx-auto h-auto w-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold">
            Wireless Headphones
          </h1>

          <div className="mt-4 flex items-center gap-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={18}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}

            <span className="text-gray-500">(124 Reviews)</span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-4xl font-bold text-orange-500">
              ₹2,499
            </span>

            <span className="text-xl text-gray-400 line-through">
              ₹3,199
            </span>
          </div>

          <p className="mt-6 text-gray-600">
            Premium wireless headphones with crystal-clear sound,
            active noise cancellation and 30-hour battery life.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white hover:bg-orange-600">
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <button className="rounded-xl border border-gray-300 p-4 hover:border-orange-500">
              <Heart />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}