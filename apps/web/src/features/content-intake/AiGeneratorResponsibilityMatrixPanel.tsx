import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratorResponsibilityMatrixCollectionWarnings,
  validateAiGeneratorResponsibilityMatrices,
} from "@living-textbook/content-model/src/aiGeneratorResponsibilityMatrix";

import type {
  AiGeneratorResponsibilityMatrix,
  AiGeneratorResponsibilityRole,
} from "@/data/sampleAiGeneratorResponsibilityMatrix";

interface AiGeneratorResponsibilityMatrixPanelProps {
  matrices: AiGeneratorResponsibilityMatrix[];
}

export function AiGeneratorResponsibilityMatrixPanel({ matrices }: AiGeneratorResponsibilityMatrixPanelProps) {
  const guardBlocks = validateAiGeneratorResponsibilityMatrices(matrices);
  const guardWarnings = getAiGeneratorResponsibilityMatrixCollectionWarnings(matrices);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generator responsibility matrix</p>
          <h2 className="mt-1 text-lg font-bold">Who owns each generator handoff</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This matrix keeps teacher review, Codex architecture, outside AI prototype work, verifier checks, and
            platform entitlements separate before any live generation or student-facing workflow exists.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Responsibility guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No live handoff" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ResponsibilityList
          title="Responsibility guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared responsibility matrix guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ResponsibilityList
          title="Responsibility guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared responsibility matrix guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-4">
        {matrices.map((matrix) => (
          <article key={matrix.matrixId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{matrix.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{matrix.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{matrix.summary}</p>
              </div>
              <StatusPill label={matrix.status} tone="warning" />
            </div>

            <section className="mt-4 rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing rules</h4>
                <StatusPill label={String(matrix.standingRules.length)} tone="warning" />
              </div>
              <ul className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--tenant-muted)]">
                {matrix.standingRules.map((rule) => (
                  <li key={rule} className="rounded-full bg-white px-3 py-1 font-semibold">
                    {rule}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-4 grid gap-3 xl:grid-cols-5">
              {matrix.roles.map((role) => (
                <ResponsibilityRoleCard key={role.roleId} role={role} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ResponsibilityRoleCard({ role }: { role: AiGeneratorResponsibilityRole }) {
  return (
    <article className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{role.owner}</p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{role.label}</h4>
        </div>
        <StatusPill label="Owner" tone="neutral" />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{role.summary}</p>

      <ResponsibilityList title="Owns" items={role.owns} />
      <ResponsibilityList title="Must provide" items={role.mustProvide} />
      <ResponsibilityList title="Handoff records" items={role.handoffRecords} />
      <ResponsibilityList title="Cannot do" items={role.cannotDo} tone="warning" />

      <section className="mt-3 rounded-md border border-[var(--tenant-border)] bg-white p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next gate</p>
        <p className="mt-1 text-sm leading-6 text-[var(--tenant-text)]">{role.nextGate}</p>
      </section>
    </article>
  );
}

function ResponsibilityList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</h5>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
