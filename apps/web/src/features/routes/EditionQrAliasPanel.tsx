import { Card, StatusPill } from "@living-textbook/ui";
import type {
  EditionQrAlias,
  EditionQrAliasPlan,
  EditionQrAliasStatus,
  EditionQrDeploymentTarget,
} from "@/data/sampleEditionQrAliasPlan";

interface EditionQrAliasPanelProps {
  plan: EditionQrAliasPlan;
}

const statusTone: Record<EditionQrAliasStatus, "neutral" | "success" | "warning"> = {
  active: "success",
  legacy: "neutral",
  draft: "warning",
  blocked: "warning",
};

const statusLabel: Record<EditionQrAliasStatus, string> = {
  active: "Active",
  legacy: "Legacy",
  draft: "Draft",
  blocked: "Blocked",
};

const deploymentLabel: Record<EditionQrDeploymentTarget, string> = {
  "hosted-route": "Hosted",
  "local-bundle": "Local bundle",
  hybrid: "Hybrid",
};

export function EditionQrAliasPanel({ plan }: EditionQrAliasPanelProps) {
  const activeCount = plan.aliases.filter((alias) => alias.status === "active").length;
  const legacyCount = plan.aliases.filter((alias) => alias.status === "legacy").length;
  const draftCount = plan.aliases.filter((alias) => alias.status === "draft").length;
  const blockedCount = plan.aliases.filter((alias) => alias.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Edition QR aliases</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${plan.aliases.length} aliases`} tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Permanence rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.permanenceRule}</p>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <AliasMetric label="Active" value={String(activeCount)} tone="success" />
        <AliasMetric label="Legacy" value={String(legacyCount)} tone="neutral" />
        <AliasMetric label="Draft" value={String(draftCount)} tone={draftCount > 0 ? "warning" : "success"} />
        <AliasMetric label="Blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Alias records</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Printed QR ids mapped to reviewed targets</h3>
            </div>
            <StatusPill label="Registry-first" tone="success" />
          </div>
          <div className="mt-3 grid gap-3">
            {plan.aliases.map((alias) => (
              <AliasCard key={alias.aliasId} alias={alias} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Redirect rules</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Rules before `/q/...` becomes real</h3>
            </div>
            <StatusPill label="Hard gate" tone="warning" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {plan.redirectRules.map((rule) => (
              <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                {rule}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}

function AliasMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function AliasCard({ alias }: { alias: EditionQrAlias }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {alias.seriesId} / {alias.bookId} / {alias.unitId} / {alias.activityId}
          </p>
          <h4 className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{alias.printedQrId}</h4>
          <p className="mt-1 break-words text-xs font-semibold text-[var(--tenant-muted)]">{alias.targetPath}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={statusLabel[alias.status]} tone={statusTone[alias.status]} />
          <StatusPill label={deploymentLabel[alias.deploymentTarget]} tone={alias.deploymentTarget === "hybrid" ? "success" : "neutral"} />
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <AliasFact label="Edition" value={`${alias.edition} / ${alias.version}`} />
        <AliasFact label="Package" value={alias.contentPackageId} />
        <AliasFact label="Target type" value={alias.targetType} />
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{alias.stableRule}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {alias.nextStep}
      </p>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {alias.notAllowedYet.map((guardrail) => (
          <li key={guardrail} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
            {guardrail}
          </li>
        ))}
      </ul>
    </article>
  );
}

function AliasFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
