import { Heart, Search, ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* Top Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <h1 className="text-4xl font-extrabold text-orange-500 cursor-pointer">
          Kotoze
        </h1>

        {/* Search */}
 {/* Search */}
<div className="mx-8 flex-1 max-w-4xl">
  <div className="relative rounded-full border border-gray-300 bg-white shadow-sm">
    <Search
      size={20}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
    />

    <input
      type="text"
      placeholder="Search products..."
      className="w-full rounded-full bg-transparent py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:outline-none"
    />
  </div>
</div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-700">

          <button className="transition hover:text-orange-500">
            <Heart size={24} strokeWidth={2} />
          </button>

          <button className="relative transition hover:text-orange-500">
            <ShoppingCart size={24} strokeWidth={2} />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
              2
            </span>
          </button>

          <button className="transition hover:text-orange-500">
            <User size={24} strokeWidth={2} />
          </button>

        </div>

      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200">
        <nav className="mx-auto flex max-w-7xl gap-10 px-6 py-3 font-medium text-gray-700">

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
            Offers
          </a>

          <a href="#" className="hover:text-orange-500 transition">
            Contact
          </a>

        </nav>
      </div>

    </header>
  );
}