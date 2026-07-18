import { ReactNode } from "react";

import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">

      <AppSidebar />

      <div className="flex flex-1 flex-col">

        <AppTopbar />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}