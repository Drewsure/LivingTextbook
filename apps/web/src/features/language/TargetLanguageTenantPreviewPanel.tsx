import { Card, StatusPill } from "@living-textbook/ui";
import type {
  TargetLanguageTenantPreview,
  TargetTenantPreviewGate,
} from "@/data/sampleTargetLanguageTenantPreview";

interface TargetLanguageTenantPreviewPanelProps {
  preview: TargetLanguageTenantPreview;
}

const gateTone: Record<TargetTenantPreviewGate["status"], "neutral" | "success" | "warning"> = {
  ready: "success",
  planned: "neutral",
  blocked: "warning",
};

export function TargetLanguageTenantPreviewPanel({ preview }: TargetLanguageTenantPreviewPanelProps) {
  const blockedGateCount = preview.gates.filter((gate) => gate.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">White-label tenant preview</p>
          <h2 className="mt-1 text-lg font-bold">{preview.tenant.displayName}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview proves that a Japanese-learning school can be configured as a separate target-language tenant. It is evidence of platform capability, not permission to launch a Japanese student route.
          </p>
        </div>
        <StatusPill label="Student route blocked" tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Tenant binding</p>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <PreviewFact label="Target language" value={preview.tenant.languageSettings?.targetLanguage ?? "Not configured"} />
          <PreviewFact label="UI language" value={preview.tenant.languageSettings?.defaultUiLanguage ?? "Not configured"} />
          <PreviewFact label="Assist languages" value={preview.tenant.languageSettings?.assistLanguages.join(", ") || "None"} />
          <PreviewFact label="Progression trigger" value="Target language only" />
        </dl>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <PreviewMetric label="Registry" value={preview.registryStatus} />
        <PreviewMetric label="Package" value={preview.packageStatus} />
        <PreviewMetric label="Blocking gates" value={String(blockedGateCount)} />
      </dl>

      <p className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm leading-6 text-[var(--tenant-text)]">
        <span className="font-semibold">Progression rule:</span> {preview.progressionTrigger}
      </p>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {preview.gates.map((gate) => (
          <section key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h3>
              <StatusPill label={gate.status} tone={gateTone[gate.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Evidence:</span> {gate.evidence}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Student impact:</span> {gate.studentImpact}
            </p>
          </section>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Blocked until evidence is approved</p>
        <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
          {preview.blockedActions.map((action, index) => (
            <li key={`${preview.previewId}-blocked-${index}`}>{action}</li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function PreviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
