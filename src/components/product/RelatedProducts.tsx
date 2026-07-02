import Image from "next/image";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Bluetooth Speaker",
    price: "₹1,999",
    image: "/images/products/headphones.jpg",
  },
  {
    id: 2,
    name: "Gaming Headset",
    price: "₹3,499",
    image: "/images/products/headphones.jpg",
  },
  {
    id: 3,
    name: "Smart Watch",
    price: "₹4,999",
    image: "/images/products/headphones.jpg",
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    price: "₹2,299",
    image: "/images/products/headphones.jpg",
  },
];

export default function RelatedProducts() {
  return (
    <section className="mt-20">
      <h2 className="mb-8 text-3xl font-bold text-white">
        You May Also Like
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-5 transition duration-300 hover:-translate-y-2 hover:border-orange-500"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={250}
              height={250}
              className="mx-auto h-48 w-full object-contain"
            />

            <h3 className="mt-5 text-lg font-semibold text-white">
              {product.name}
            </h3>

            <div className="mt-2 flex items-center gap-1 text-yellow-400">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>

            <p className="mt-3 text-2xl font-bold text-orange-500">
              {product.price}
            </p>

            <button className="mt-5 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600">
              View Product
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}