import type { CSSProperties, ReactNode } from "react";
import type { TenantConfig } from "@/features/tenant/types";

interface AppShellProps {
  children: ReactNode;
  tenant: TenantConfig;
  compact?: boolean;
}

function getTenantStyle(tenant: TenantConfig): CSSProperties {
  return {
    "--tenant-primary": tenant.brand.primary,
    "--tenant-primary-text": tenant.brand.primaryText,
    "--tenant-primary-soft": tenant.brand.primarySoft,
    "--tenant-accent": tenant.brand.accent,
    "--tenant-accent-text": tenant.brand.accentText,
    "--tenant-accent-soft": tenant.brand.accentSoft,
    "--tenant-background": tenant.brand.background,
    "--tenant-surface": tenant.brand.surface,
    "--tenant-text": tenant.brand.text,
    "--tenant-muted": tenant.brand.muted,
    "--tenant-border": tenant.brand.border,
  } as CSSProperties;
}

export function AppShell({ children, tenant, compact = false }: AppShellProps) {
  return (
    <main
      style={getTenantStyle(tenant)}
      className="min-h-screen bg-[var(--tenant-background)] text-[var(--tenant-text)] print:bg-white"
    >
      <header className="border-b border-[var(--tenant-border)] bg-[var(--tenant-surface)] print:hidden">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">
              White-label tenant
            </p>
            <h1 className="text-lg font-bold">{tenant.displayName}</h1>
          </div>
          {!compact && (
            <nav className="flex flex-wrap justify-end gap-3 text-sm font-semibold text-[var(--tenant-text)]" aria-label="Primary">
              <a href="/">Overview</a>
              <a href="/teacher">Teacher Launch</a>
              <a href="/teacher/intake">Content Intake</a>
              <a href="/teacher/persistence">Persistence</a>
              <a href="/teacher/game-readiness">Game Readiness</a>
              <a href="/teacher/prototypes/sample-publisher">Prototypes</a>
              <a href="/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run">Dry Run</a>
              <a href="/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate">Launch Gate</a>
              <a href="/teacher/review">Review Queue</a>
              <a href="/teacher/library/sample-publisher">Library</a>
              <a href="/teacher/maintenance/sample-publisher">Maintenance</a>
              <a href="/teacher/release-control/sample-publisher">Release</a>
              <a href="/teacher/uploads/sample-publisher">Uploads</a>
              <a href="/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram">Assets</a>
              <a href="/teacher/assets/media/sample-publisher-l1-u1-routines-media">Media Asset</a>
              <a href="/teacher/media/sample-publisher">Media</a>
              <a href="/teacher/sessions/demo-unit-1">Session Monitor</a>
              <a href="/partner-demo">Partner Demo</a>
              <a href="/local/sample-publisher">Local Preview</a>
            </nav>
          )}
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 print:max-w-none print:px-0 print:py-0">{children}</div>
    </main>
  );
}
