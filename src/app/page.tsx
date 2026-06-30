import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
export default function Home() {
  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Groceries",
    "Automobile",
    "Industrial",
  ];

  const products = [
    {
      name: "Wireless Headphones",
      price: "₹2,499",
      oldPrice: "₹3,199",
      image: "🎧",
      rating: "★★★★★",
      reviews: 124,
      discount: "20% OFF",
    },
    {
      name: "Smart Watch",
      price: "₹3,299",
      oldPrice: "₹4,199",
      image: "⌚",
      rating: "★★★★☆",
      reviews: 89,
      discount: "15% OFF",
    },
    {
      name: "Laptop Backpack",
      price: "₹1,499",
      oldPrice: "₹1,999",
      image: "🎒",
      rating: "★★★★★",
      reviews: 57,
      discount: "25% OFF",
    },
    {
      name: "Office Chair",
      price: "₹5,999",
      oldPrice: "₹7,499",
      image: "🪑",
      rating: "★★★★☆",
      reviews: 41,
      discount: "18% OFF",
    },
  ];

  return (
    <main className="min-h-screen bg-white">

      {/* NAVBAR */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-3xl font-bold text-orange-500">Kotoze</h1>

          <nav className="hidden gap-10 text-lg md:flex">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">Categories</a>
            <a href="#">Contact</a>
          </nav>

          <button className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
            Login
          </button>
        </div>
      </header>

      <Hero />

      {/* CATEGORIES */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">
            Shop by Category
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-2xl bg-white p-6 text-center shadow transition hover:-translate-y-2"
              >
                <div className="mb-3 text-4xl">📦</div>
                <h3 className="font-semibold text-gray-700">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">
            Featured Products
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.name}
                className="overflow-hidden rounded-2xl border bg-white shadow-md transition hover:-translate-y-2"
              >

                {/* TOP BAR */}
                <div className="flex items-center justify-between bg-orange-500 px-4 py-2 text-white">
                  <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold">
                    {product.discount}
                  </span>

                  <button className="text-xl">🤍</button>
                </div>

                {/* IMAGE */}
                <div className="flex h-52 items-center justify-center bg-gray-100 text-9xl">
                  {product.image}
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-yellow-500">
                    {product.rating}{" "}
                    <span className="text-gray-500">
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

                  <button className="mt-4 w-full rounded-xl bg-orange-500 py-2 font-bold text-white hover:bg-orange-600">
                    🛒 Add to Cart
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