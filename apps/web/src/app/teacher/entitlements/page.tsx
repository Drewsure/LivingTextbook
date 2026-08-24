import { Card, StatusPill } from "@living-textbook/ui";
import type { ReactNode } from "react";
import type { TenantConfig } from "@/features/tenant/types";
import { AppShell } from "@/components/layout/AppShell";
import { sampleAiGeneratorCostEntitlementGates } from "@/data/sampleAiGeneratorCostEntitlementGate";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import { samplePackageAdoptionRecordPreviews } from "@/data/samplePackageAdoptionRecordPreview";
import { samplePackageAdoptionReadinessItems } from "@/data/samplePackageAdoptionReadiness";
import { samplePartnerContentPackage } from "@/data/samplePartnerPackage";
import { sampleWhiteLabelPackageCatalog } from "@/data/sampleWhiteLabelPackageCatalog";
import { AiGeneratorCostEntitlementGatePanel } from "@/features/content-intake/AiGeneratorCostEntitlementGatePanel";
import { PackageAdoptionRecordPreviewPanel } from "@/features/entitlements/PackageAdoptionRecordPreviewPanel";
import { PackageAdoptionReadinessPanel } from "@/features/entitlements/PackageAdoptionReadinessPanel";
import { PackageTierCatalogPanel } from "@/features/entitlements/PackageTierCatalogPanel";
import { VoiceTutorPackagePanel } from "@/features/ai-tutor/VoiceTutorPackagePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { getAiTutorAvailability } from "@/features/tenant/tenantEntitlements";

const packageBoundaries = [
  {
    title: "Core classroom package",
    state: "Included foundation",
    summary:
      "QR/front-door launch, target-language audio, curated game pathways, Training Academy recovery, teacher report previews, and local record/replay policy stay in the base product.",
    checks: [
      "Target-language learning audio included",
      "Curated activity pathways included",
      "Teacher-visible progress summary included",
      "Student-facing premium upsell excluded",
    ],
  },
  {
    title: "Premium AI generation",
    state: "Review-only",
    summary:
      "Teacher-side AI package creation, image prompt drafting, voice generation, and verifier-assisted authoring need tenant package selection, school policy approval, model rate cards, and hard usage budgets.",
    checks: ["No live model billing", "No direct AI publish", "No teacher self-enable", "No child-triggered cost"],
  },
  {
    title: "Voice Tutor and speech scoring",
    state: "Optional paid package",
    summary:
      "AI Tutor, microphone scoring, speech matching, transcript analysis, and generated tutor feedback stay disabled until a school explicitly buys and enables that layer.",
    checks: [
      "Teacher or school approval required",
      "No microphone permission prompt from this route",
      "No raw audio storage",
      "No transcript storage",
    ],
  },
  {
    title: "Hosted storage and local companion",
    state: "Policy gated",
    summary:
      "Hosted persistence, exports, closed local companion packages, and offline report handoff require storage policy, retention policy, release control, and evidence-packet approval.",
    checks: ["No report export from this route", "No object storage write", "No local folder write", "No release-state mutation"],
  },
];

const costControlStatements = [
  {
    label: "No premium upsell shown to children",
    value:
      "Students should never see package pricing, trial pressure, paid feature prompts, or spending-triggering controls inside learning routes.",
  },
  {
    label: "No speech API billing",
    value:
      "Local record/replay can stay free and browser-local; AI transcription, pronunciation scoring, generated speech, and AI Tutor feedback are separate paid packages.",
  },
  {
    label: "No storage surprise",
    value:
      "Hosted persistence, local companion exports, media processing, report export, and evidence attachment storage need explicit tenant or school policy gates.",
  },
  {
    label: "No support-language loophole",
    value:
      "Assist-language text, labels, and audio remain support-only; target-language interaction is the only student progress trigger.",
  },
];

const crossLinks = [
  { href: "/teacher/session-settings", label: "Session settings" },
  { href: "/teacher/reporting", label: "Reporting readiness" },
  { href: "/teacher/persistence", label: "Persistence readiness" },
  { href: "/teacher/generator/sample-publisher", label: "AI generator gate" },
  { href: "/teacher/game-readiness", label: "Game readiness" },
];

export default function TeacherEntitlementsPage() {
  const tenantPackages = [
    {
      tenant: ministarTenant,
      packageName: "MiniStar reference tenant",
      plan: sampleMultimediaContentPackage.aiTutorPlans?.[0],
      availability: getAiTutorAvailability({ tenant: ministarTenant, level: 1 }),
    },
    {
      tenant: samplePublisherTenant,
      packageName: "Sample publisher tenant",
      plan: samplePartnerContentPackage.aiTutorPlans?.[0],
      availability: getAiTutorAvailability({ tenant: samplePublisherTenant, level: 1 }),
    },
  ];

  return (
    <AppShell tenant={ministarTenant}>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package entitlement workbench</p>
              <h2 className="mt-1 text-2xl font-bold">Optional paid features, cost gates, and tenant controls</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
                This teacher/admin route keeps premium AI, microphone scoring, Voice Tutor, hosted storage, report
                export, and local companion options visible as product decisions without enabling live billing, live
                model calls, microphone permission prompts, or student-facing purchase pressure.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <StatusPill label="Review-only" tone="warning" />
              <StatusPill label="No live model billing" tone="warning" />
              <StatusPill label="No child-facing upsell" tone="warning" />
              <StatusPill label="No package activation" tone="warning" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {packageBoundaries.map((boundary) => (
              <section
                key={boundary.title}
                className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[var(--tenant-text)]">{boundary.title}</h3>
                  <StatusPill label={boundary.state} tone={boundary.state === "Included foundation" ? "success" : "warning"} />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{boundary.summary}</p>
                <ul className="mt-3 grid gap-2 text-xs font-semibold leading-5 text-[var(--tenant-text)]">
                  {boundary.checks.map((check) => (
                    <li key={`${boundary.title}-${check}`}>{check}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Commercial safety policy</p>
              <h2 className="mt-1 text-lg font-bold">Premium features stay adult-controlled</h2>
            </div>
            <StatusPill label="Cost-safe foundation" tone="success" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {costControlStatements.map((statement) => (
              <section
                key={statement.label}
                className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"
              >
                <h3 className="text-sm font-bold text-[var(--tenant-text)]">{statement.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{statement.value}</p>
              </section>
            ))}
          </div>
        </Card>

        <PackageTierCatalogPanel packages={sampleWhiteLabelPackageCatalog} />

        <PackageAdoptionReadinessPanel items={samplePackageAdoptionReadinessItems} />

        <PackageAdoptionRecordPreviewPanel records={samplePackageAdoptionRecordPreviews} />

        <AiGeneratorCostEntitlementGatePanel gates={sampleAiGeneratorCostEntitlementGates} />

        <section className="grid gap-4 lg:grid-cols-2">
          {tenantPackages.map((tenantPackage) => (
            <TenantVoiceTutorCard key={tenantPackage.tenant.id} packageName={tenantPackage.packageName} tenant={tenantPackage.tenant}>
              <VoiceTutorPackagePanel availability={tenantPackage.availability} plan={tenantPackage.plan} />
            </TenantVoiceTutorCard>
          ))}
        </section>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Related gates</p>
              <h2 className="mt-1 text-lg font-bold">Keep entitlement decisions tied to launch, report, and storage policy</h2>
            </div>
            <StatusPill label="No live workflow" tone="warning" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {crossLinks.map((link) => (
              <a
                key={link.href}
                className="inline-flex min-h-11 items-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function TenantVoiceTutorCard({
  children,
  packageName,
  tenant,
}: {
  children: ReactNode;
  packageName: string;
  tenant: TenantConfig;
}) {
  return (
    <div className="grid gap-3">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">{packageName}</p>
            <h2 className="mt-1 text-lg font-bold">{tenant.displayName}</h2>
          </div>
          <StatusPill label={tenant.featureEntitlements?.aiTutor?.enabled ? "Premium enabled" : "Premium disabled"} tone="warning" />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <PackageMetric label="Allowed levels" value={tenant.featureEntitlements?.aiTutor?.allowedLevels.join(", ") ?? "Not configured"} />
          <PackageMetric label="Monthly usage limit" value={String(tenant.featureEntitlements?.aiTutor?.monthlyUsageLimit ?? 0)} />
          <PackageMetric label="School enabled" value={tenant.featureEntitlements?.aiTutor?.schoolEnabled ? "Yes" : "No"} />
        </dl>
      </Card>
      {children}
    </div>
  );
}

function PackageMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
