import Image from "next/image";
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
    <div className="overflow-hidden rounded-2xl border bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="flex items-center justify-between bg-orange-500 px-4 py-2 text-white">
        <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold">
          {product.discount}
        </span>

        <button className="text-xl">🤍</button>
      </div>

<div className="flex h-56 items-center justify-center bg-gray-100 p-4">
  <Image
    src={product.image}
    alt={product.name}
    width={220}
    height={220}
    className="h-44 w-auto object-contain transition-transform duration-300 hover:scale-105"
  />
</div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-yellow-500">
          {product.rating}
          <span className="ml-2 text-gray-500">
            ({product.reviews})
          </span>
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">
            {product.price}
          </span>

          <span className="text-sm text-gray-400 line-through">
            {product.oldPrice}
          </span>
        </div>

        <button className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600">
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}