export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white">
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold text-green-400">
          Kotoze
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Admin Panel
        </p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li className="rounded-lg bg-slate-800 px-4 py-3">
            Dashboard
          </li>

          <li className="rounded-lg px-4 py-3 hover:bg-slate-800 cursor-pointer">
            Users
          </li>

          <li className="rounded-lg px-4 py-3 hover:bg-slate-800 cursor-pointer">
            Roles
          </li>

          <li className="rounded-lg px-4 py-3 hover:bg-slate-800 cursor-pointer">
            Categories
          </li>

          <li className="rounded-lg px-4 py-3 hover:bg-slate-800 cursor-pointer">
            Brands
          </li>

          <li className="rounded-lg px-4 py-3 hover:bg-slate-800 cursor-pointer">
            Products
          </li>

          <li className="rounded-lg px-4 py-3 hover:bg-slate-800 cursor-pointer">
            Orders
          </li>

          <li className="rounded-lg px-4 py-3 hover:bg-slate-800 cursor-pointer">
            Settings
          </li>
        </ul>
      </nav>
    </aside>
  );
}