import Header from "@/components/Header";
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-3xl font-bold text-orange-500">
          Kotoze
        </h1>

        <nav className="hidden gap-10 text-lg font-medium text-gray-700 md:flex">
          <a href="#" className="hover:text-orange-500 transition">
            Home
          </a>

          <a href="#" className="hover:text-orange-500 transition">
            Products
          </a>

          <a href="#" className="hover:text-orange-500 transition">
            Categories
          </a>

          <a href="#" className="hover:text-orange-500 transition">
            Contact
          </a>
        </nav>

        <button className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
          Login
        </button>
      </div>
    </header>
  );
}