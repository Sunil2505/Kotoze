import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
} from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-orange-500">
            Kotoze
          </span>
        </div>

        {/* Search */}
        <div className="hidden w-full max-w-xl items-center rounded-lg border border-gray-300 px-3 py-2 md:flex">
          <Search size={18} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search products..."
            className="ml-2 w-full outline-none"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          <button className="hidden text-gray-700 hover:text-orange-500 md:block">
            Categories
          </button>

          <Heart
            size={22}
            className="cursor-pointer text-gray-700 hover:text-red-500"
          />

          <ShoppingCart
            size={22}
            className="cursor-pointer text-gray-700 hover:text-orange-500"
          />

          <User
            size={22}
            className="cursor-pointer text-gray-700 hover:text-orange-500"
          />

          <button className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600">
            Login
          </button>

          <Menu
            size={24}
            className="cursor-pointer md:hidden"
          />
        </div>
      </div>
    </header>
  );
}