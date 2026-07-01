import brands from "@/data/brands";

export default function Brands() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-3 text-center text-4xl font-bold text-gray-900">
          Shop by Brands
        </h2>

        <p className="mb-10 text-center text-gray-500">
          Explore products from the world's most trusted brands.
        </p>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group flex h-24 cursor-pointer items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-xl"
            >
              <span className="text-lg font-bold text-gray-700 transition-colors duration-300 group-hover:text-orange-500">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}