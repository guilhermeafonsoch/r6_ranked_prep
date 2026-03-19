import type { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";

type AppShellProps = {
  children: ReactNode;
  userName?: string | null;
};

export function AppShell({ children, userName }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[color:var(--surface-0)] text-[color:var(--text-strong)]">
      <div className="relative flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <div className="relative flex min-h-screen flex-1 flex-col">
          <TopNav userName={userName} />
          <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
