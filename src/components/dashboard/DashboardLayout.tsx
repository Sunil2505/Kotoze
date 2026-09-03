import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div
        style={{ marginLeft: "288px" }}
        className="flex h-full min-h-0 min-w-0 flex-1 flex-col"
      >
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="min-h-0 flex-1 overflow-hidden bg-slate-50">
          <div className="h-full min-h-0 w-full max-w-[1700px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}