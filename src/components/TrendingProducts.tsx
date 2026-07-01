import ProductCard from "./ProductCard";
import trendingProducts from "@/data/trending";

export default function TrendingProducts() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold text-gray-900">
          🔥 Trending Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}