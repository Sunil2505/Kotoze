export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-orange-500">
          Kartly
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="w-[420px] rounded-xl border border-gray-300 px-4 py-2 outline-none transition focus:border-orange-500"
        />

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <button className="text-gray-700 hover:text-orange-500">
            Categories
          </button>

          <button className="text-gray-700 hover:text-orange-500">
            Become Seller
          </button>

          <button className="rounded-lg bg-orange-500 px-5 py-2 text-white hover:bg-orange-600">
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}