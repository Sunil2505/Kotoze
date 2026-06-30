import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
export default function Home() {
  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Groceries",
    "Automobile",
    "Industrial",
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

  <FeaturedProducts />
  <Footer />
    </main>
  );
}