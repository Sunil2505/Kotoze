const categories = [
  "Electronics",
  "Fashion",
  "Home",
  "Groceries",
  "Automobile",
  "Industrial",
];

const products = [
  { name: "Wireless Headphones", price: "₹2,499" },
  { name: "Office Chair", price: "₹5,999" },
  { name: "Smart Watch", price: "₹3,299" },
  { name: "Laptop Backpack", price: "₹1,499" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-3xl font-bold text-orange-600">Kotoze</h1>

          <nav className="hidden gap-8 text-gray-700 md:flex">
            <a href="#" className="hover:text-orange-500">
              Home
            </a>
            <a href="#" className="hover:text-orange-500">
              Products
            </a>
            <a href="#" className="hover:text-orange-500">
              Categories
            </a>
            <a href="#" className="hover:text-orange-500">
              Contact
            </a>
          </nav>

          <button className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600">
            Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-6 text-5xl font-bold text-gray-900 md:text-7xl">
          Everything You Need,
          <span className="text-orange-500"> All in One Place.</span>
        </h2>

        <p className="mb-8 max-w-2xl text-lg text-gray-600">
          Buy products from trusted sellers across India with the fastest and
          simplest marketplace experience.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-600">
            Shop Now
          </button>

          <button className="rounded-xl border-2 border-orange-500 bg-white px-8 py-4 text-lg font-semibold text-orange-500 hover:bg-orange-50">
            Become a Seller
          </button>
        </div>

        {/* Search */}
        <div className="mt-12 flex w-full max-w-3xl overflow-hidden rounded-xl border-2 border-orange-500 shadow-lg">
          <input
            type="text"
            placeholder="Search products, shops, categories..."
            className="flex-1 px-6 py-4 text-lg outline-none"
          />

          <button className="bg-orange-500 px-8 font-semibold text-white hover:bg-orange-600">
            Search
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-center text-4xl font-bold text-gray-900">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <div
                key={category}
                className="cursor-pointer rounded-2xl bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-3 text-5xl">📦</div>

                <h3 className="font-semibold text-gray-700">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-center text-4xl font-bold text-gray-900">
            Featured Products
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.name}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-52 items-center justify-center bg-gray-100 text-7xl">
                  📦
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-2xl font-bold text-orange-500">
                    {product.price}
                  </p>

                  <button className="mt-5 w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}