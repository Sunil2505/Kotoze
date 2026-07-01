import categories from "@/data/categories";

export default function Categories() {
  return (
    <section className="bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold text-gray-900">
          Shop by Category
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl bg-white p-6 text-center border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
            <div className="mb-4 flex justify-center">
              <category.icon
                size={48}
                className="text-orange-500 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
              <h3 className="font-semibold text-gray-700">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}