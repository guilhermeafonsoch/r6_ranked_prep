"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  Compass,
  LayoutDashboard,
  ShieldBan,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prep", label: "Prep", icon: Compass },
  { href: "/bans", label: "Ban Assistant", icon: ShieldBan },
  { href: "/playbook", label: "Playbook", icon: BookMarked },
  { href: "/patches", label: "Patch Feed", icon: ShieldCheck },
  { href: "/admin", label: "Admin", icon: Wrench },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-20 border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-0)]/90 backdrop-blur md:h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-4 md:block">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-[color:var(--text-strong)]">
            Ranked Prep Assistant
          </p>
          <p className="text-sm text-[color:var(--text-subtle)]">Rainbow Six Siege MVP</p>
        </div>
        <Badge className="md:mt-3" variant="amber">
          Demo auth
        </Badge>
      </div>

      <nav className="scrollbar-none flex gap-2 overflow-x-auto px-3 pb-4 md:flex-col md:px-4 md:py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-fit items-center gap-3 rounded-xl border px-3 py-2 text-sm transition md:min-w-0",
                active
                  ? "border-[color:var(--accent-soft)] bg-[color:var(--accent-soft)]/15 text-[color:var(--text-strong)]"
                  : "border-transparent text-[color:var(--text-muted)] hover:border-[color:var(--border-subtle)] hover:bg-[color:var(--surface-1)]",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
