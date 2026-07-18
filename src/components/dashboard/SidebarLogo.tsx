import Link from "next/link";

export default function SidebarLogo() {
  return (
    <Link
      href="/dashboard"
      className="flex h-16 items-center border-b border-slate-800 px-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-emerald-400">
          KOTOZE
        </h1>

        <p className="text-xs text-slate-400">
          Enterprise Admin
        </p>
      </div>
    </Link>
  );
}