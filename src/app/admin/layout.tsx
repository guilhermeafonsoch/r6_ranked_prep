import Link from "next/link";

import { ErrorState } from "@/components/states/error-state";
import { adminSections } from "@/lib/constants";
import { isAdminEnabled } from "@/lib/demo-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdminEnabled()) {
    return (
      <ErrorState
        title="Admin disabled"
        description="Set ENABLE_DEV_ADMIN=true in your environment to use the content tools."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-full border border-[color:var(--border-subtle)] px-3 py-2 text-sm text-[color:var(--text-muted)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-1)] hover:text-[color:var(--text-strong)]"
          >
            {section.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
