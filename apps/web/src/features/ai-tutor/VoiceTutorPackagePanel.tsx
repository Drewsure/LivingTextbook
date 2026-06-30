import { Card, StatusPill } from "@living-textbook/ui";
import type { UnitAiTutorPlan } from "@living-textbook/content-model";
import type { AiTutorAvailability } from "@/features/tenant/tenantEntitlements";
import {
  getVoiceTutorReadiness,
  voiceTutorCapabilityCatalog,
  type VoiceTutorBuildPhase,
} from "./voiceTutorCapabilities";

interface VoiceTutorPackagePanelProps {
  availability: AiTutorAvailability;
  plan?: UnitAiTutorPlan;
}

const phaseLabels: Record<VoiceTutorBuildPhase, string> = {
  "ready-now": "Ready",
  "foundation-next": "Next",
  "premium-later": "Premium",
};

export function VoiceTutorPackagePanel({ availability, plan }: VoiceTutorPackagePanelProps) {
  const readiness = getVoiceTutorReadiness(plan);
  const visibleCapabilities = voiceTutorCapabilityCatalog.slice(0, 4);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Premium speech layer</p>
          <h2 className="mt-1 text-lg font-bold">Voice Tutor</h2>
        </div>
        <StatusPill label={availability.available ? "Premium on" : readiness.statusLabel} tone={availability.available ? "success" : "warning"} />
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{availability.reason}</p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Capabilities" value={String(readiness.plannedCount)} />
        <Metric label="Next layer" value={String(readiness.nextCount)} />
        <Metric label="Premium gated" value={String(readiness.premiumCount)} />
      </dl>

      <div className="mt-4 grid gap-3">
        {visibleCapabilities.map((capability) => (
          <article key={capability.id} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold">{capability.label}</h3>
                <p className="mt-1 text-xs text-[var(--tenant-muted)]">
                  {capability.processingPreference} / {capability.mode ?? "unit-scoped"}
                </p>
              </div>
              <StatusPill label={phaseLabels[capability.buildPhase]} tone={capability.buildPhase === "foundation-next" ? "success" : "neutral"} />
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{capability.costControl}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
