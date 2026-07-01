import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
type Product = {
  name: string;
  price: string;
  oldPrice: string;
  image: string;
  rating: string;
  reviews: number;
  discount: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="flex items-center justify-between bg-orange-500 px-4 py-2 text-white">
        <span className="rounded bg-orange-500 px-2 py-1 text-xs font-bold">
          {product.discount}
        </span>

       <button className="transition hover:text-red-500">
         <Heart size={20} />
      </button>
      </div>

<div className="flex h-56 items-center justify-center bg-gray-100 p-4">
  <Image
  src={product.image}
  alt={product.name}
  width={220}
  height={220}
  className="h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
/>
</div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}

          <span className="ml-2 text-sm text-gray-500">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">
            {product.price}
          </span>

          <span className="text-sm text-gray-400 line-through">
            {product.oldPrice}
          </span>
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg">
          <ShoppingCart size={20} />
           Add to Cart
      </button>
      </div>
    </div>
  );
}