import type { ReactNode } from "react";
import type { TenantConfig } from "@/features/tenant/types";

interface AppShellProps {
  children: ReactNode;
  tenant: TenantConfig;
  compact?: boolean;
}

export function AppShell({ children, tenant, compact = false }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">White-label tenant</p>
            <h1 className="text-lg font-bold">{tenant.displayName}</h1>
          </div>
          {!compact && (
            <nav className="flex gap-3 text-sm font-semibold text-slate-700" aria-label="Primary">
              <a href="/">Overview</a>
              <a href="/teacher">Teacher Launch</a>
            </nav>
          )}
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-6">{children}</div>
    </main>
  );
}
