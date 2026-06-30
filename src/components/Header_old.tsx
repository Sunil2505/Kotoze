import {
  Heart,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* Top Header */}
      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">

          {/* Logo */}
          <h1 className="cursor-pointer text-3xl font-extrabold text-orange-500">
            Kotoze
          </h1>

          {/* Search */}
{/* Search */}
<div className="mx-6 flex-1 max-w-2xl">
  <div className="relative">
    <Search
      size={20}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
    />

    <input
      type="text"
      placeholder="Search products..."
      className="h-12 w-full rounded-full border border-gray-300 bg-white pl-12 pr-4 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
    />
  </div>
</div>

          {/* Icons */}
<div className="flex items-center gap-5 text-gray-700">

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
      </div>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

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
            Offers
          </a>

          <a href="#" className="hover:text-orange-500">
            Contact
          </a>

        </div>
      </nav>

    </header>
  );
}