import type { CSSProperties, ReactNode } from "react";
import {
  getLocalCompanionPreviewPath,
  getTeacherAiGameGeneratorPath,
  getTeacherDraftReviewQueuePath,
  getTeacherEvidencePacketHandoffPath,
  getTeacherEvidencePacketReviewPath,
  getTeacherLabelledDiagramAssetWorkspacePath,
  getTeacherMediaAssetWorkspacePath,
  getTeacherMediaLibraryPath,
  getTeacherPrivateLibraryPath,
  getTeacherPrototypeReviewPath,
  getTeacherPublisherMaintenancePath,
  getTeacherReleaseControlPath,
  getTeacherSchoolPolicyHandoffPath,
  getTeacherSessionMonitorPath,
  getTeacherSourceReviewWorkspacePath,
  getTeacherUploadWorkspacePath,
  getTenantTeacherDraftReviewQueuePath,
} from "@/features/routes/routeContracts";
import type { TenantConfig } from "@/features/tenant/types";

interface AppShellProps {
  children: ReactNode;
  tenant: TenantConfig;
  compact?: boolean;
}

interface AppShellNavItem {
  label: string;
  href: string;
}

const samplePublisherLabelledDiagramAssetId = "sample-publisher-l1-u1-labelled-diagram";
const samplePublisherMediaAssetId = "sample-publisher-l1-u1-routines-media";
const samplePublisherTeacherDryRunId = "sample-publisher-first-handoff-teacher-dry-run";
const samplePublisherLaunchGateId = "starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate";
const samplePublisherSchoolPolicyPacketId =
  "starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet";

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

function getAppShellNavItems(tenant: TenantConfig): AppShellNavItem[] {
  const coreLinks: AppShellNavItem[] = [
    { label: "Overview", href: "/" },
    { label: "Teacher Launch", href: "/teacher" },
    { label: "Content Intake", href: "/teacher/intake" },
    { label: "Session Settings", href: "/teacher/session-settings" },
    { label: "Assignments", href: "/teacher/assignments" },
    { label: "Persistence", href: "/teacher/persistence" },
    { label: "Reporting", href: "/teacher/reporting" },
    { label: "Entitlements", href: "/teacher/entitlements" },
    { label: "Game Readiness", href: "/teacher/game-readiness" },
  ];

  const tenantReviewLinks: AppShellNavItem[] = [
    { label: "Sources", href: getTeacherSourceReviewWorkspacePath(tenant.id) },
    { label: "AI Generator", href: getTeacherAiGameGeneratorPath(tenant.id) },
    { label: "Prototypes", href: getTeacherPrototypeReviewPath(tenant.id) },
    { label: "Review Queue", href: getTenantTeacherDraftReviewQueuePath(tenant.id) },
    { label: "Media", href: getTeacherMediaLibraryPath(tenant.id) },
    { label: "Local Preview", href: getLocalCompanionPreviewPath(tenant.id) },
  ];

  if (tenant.id === "ministar") {
    return [
      ...coreLinks,
      ...tenantReviewLinks,
      { label: "Session Monitor", href: getTeacherSessionMonitorPath("demo-unit-1") },
    ];
  }

  if (tenant.id === "sample-publisher") {
    return [
      ...coreLinks,
      ...tenantReviewLinks,
      { label: "Dry Run", href: `/teacher/dry-run/${samplePublisherTeacherDryRunId}` },
      { label: "Launch Gate", href: `/teacher/launch-gate/${samplePublisherLaunchGateId}` },
      { label: "Global Review", href: getTeacherDraftReviewQueuePath() },
      { label: "Library", href: getTeacherPrivateLibraryPath(tenant.id) },
      { label: "Maintenance", href: getTeacherPublisherMaintenancePath(tenant.id) },
      { label: "Release", href: getTeacherReleaseControlPath(tenant.id) },
      { label: "Uploads", href: getTeacherUploadWorkspacePath(tenant.id) },
      { label: "Evidence", href: getTeacherEvidencePacketReviewPath(tenant.id) },
      { label: "Handoff", href: getTeacherEvidencePacketHandoffPath(tenant.id) },
      { label: "Policy", href: getTeacherSchoolPolicyHandoffPath(samplePublisherSchoolPolicyPacketId) },
      { label: "Assets", href: getTeacherLabelledDiagramAssetWorkspacePath(samplePublisherLabelledDiagramAssetId) },
      { label: "Media Asset", href: getTeacherMediaAssetWorkspacePath(samplePublisherMediaAssetId) },
      { label: "Session Monitor", href: getTeacherSessionMonitorPath("partner-demo-unit-1") },
      { label: "Partner Demo", href: "/partner-demo" },
    ];
  }

  return [
    ...coreLinks,
    { label: "Review Queue", href: getTeacherDraftReviewQueuePath() },
  ];
}

export function AppShell({ children, tenant, compact = false }: AppShellProps) {
  const navItems = getAppShellNavItems(tenant);

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
              {navItems.map((item) => (
                <a key={`${tenant.id}-${item.label}-${item.href}`} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 print:max-w-none print:px-0 print:py-0">{children}</div>
    </main>
  );
}
