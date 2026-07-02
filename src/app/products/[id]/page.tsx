"use client";
import { useCart } from "@/context/CartContext";
import { Star, Heart, ShoppingCart } from "lucide-react";
import ProductGallery from "../../../components/product/ProductGallery";
import ProductTabs from "../../../components/product/ProductTabs";
import RelatedProducts from "../../../components/product/RelatedProducts";
export default function ProductDetails() {
  const { addToCart } = useCart();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-2">

        {/* Product Image */}
        <ProductGallery />

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

          <div className="mt-6 flex flex-wrap items-center gap-4">
  <span className="text-5xl font-extrabold text-orange-500">
    ₹2,499
  </span>

  <span className="text-2xl text-gray-500 line-through">
    ₹3,199
  </span>

  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
    22% OFF
  </span>
</div>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <span className="font-medium text-green-600">
          ✓ In Stock
        </span>

        <span className="text-gray-300">
          🚚 Free Delivery within 2 – 4 days
        </span>

        <span className="text-gray-300">
          🔒 100% Secure Payment
        </span>
      </div>

            <p className="mt-6 text-lg leading-8 text-gray-100">
              Premium wireless headphones with crystal-clear sound,
              active noise cancellation and 30-hour battery life.
            </p>

          <div className="mt-8">
  {/* Quantity */}
  <div className="mb-6 flex items-center gap-4">
    <span className="font-semibold text-gray-300">
      Quantity
    </span>

    <div className="flex items-center overflow-hidden rounded-lg border border-gray-700">
      <button className="px-4 py-2 text-xl transition hover:bg-gray-800">
        -
      </button>

      <span className="border-x border-gray-700 px-6 py-2">
        1
      </span>

      <button className="px-4 py-2 text-xl transition hover:bg-gray-800">
        +
      </button>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex flex-wrap gap-4">


<button
  onClick={() =>
    addToCart({
      id: 1,
      name: "Wireless Headphones",
      price: 2499,
      image: "/images/products/headphones.jpg",
      quantity: 1,
    })
  }
  className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
>
  <ShoppingCart size={20} />
  Add to Cart
</button>





    <button className="rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-green-700">
      Buy Now
    </button>

    <button className="rounded-xl border border-gray-600 p-4 transition hover:border-orange-500">
      <Heart />
    </button>
  </div>
</div>
        </div>

      </div>
      <ProductTabs />
      <RelatedProducts />
    </main>
  );
}