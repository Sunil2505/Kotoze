import categories from "@/data/categories";

export default function Categories() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">
          Shop by Category
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl bg-white p-6 text-center shadow transition hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="mb-3 text-5xl">{category.icon}</div>

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