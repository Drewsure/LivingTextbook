import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PhaserCandidateWrapperBridge,
  PhaserCandidateWrapperBridgeCheck,
  PhaserCandidateWrapperBridgeCheckStatus,
} from "@living-textbook/content-model";

const checkLabels: Record<PhaserCandidateWrapperBridgeCheckStatus, string> = { passed: "Passed", pending: "Pending", blocked: "Blocked" };
const checkTones: Record<PhaserCandidateWrapperBridgeCheckStatus, "success" | "neutral" | "warning"> = { passed: "success", pending: "neutral", blocked: "warning" };

export function MemoryMatchWrapperBridgePanel({ bridge, errors }: { bridge: PhaserCandidateWrapperBridge; errors: string[] }) {
  const passed = bridge.checks.filter((check) => check.status === "passed").length;
  const blocked = bridge.checks.filter((check) => check.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Wrapper bridge review</p>
          <h2 className="mt-1 text-lg font-bold">Memory Match evidence to canonical pairing contract</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">{bridge.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2"><StatusPill label="Wrapper blocked" tone="warning" /><StatusPill label={`${passed}/${bridge.checks.length} checks passed`} tone="neutral" /><StatusPill label={`${blocked} blocker(s)`} tone="warning" /></div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Candidate package" value={bridge.candidatePackageId} />
        <Fact label="Tenant / engine" value={`${bridge.tenantId} / ${bridge.parentEngine}`} />
        <Fact label="Canonical scoring" value={bridge.canonicalSurface.scoringProfile} />
        <Fact label="Source commit" value={bridge.source.commitSha.slice(0, 12)} />
      </div>
      <section className="mt-5"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Admission checks</p><div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{bridge.checks.map((check) => <CheckCard key={check.checkId} check={check} />)}</div></section>
      <div className="mt-5 grid gap-4 lg:grid-cols-2"><List title="Required normalization" items={bridge.normalizationPlan} /><List title="Blocked actions" items={bridge.blockedActions} /></div>
      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next action</p><p className="mt-2 text-sm font-bold text-[var(--tenant-text)]">{bridge.nextAction}</p></section>
      {errors.length > 0 && <List title="Bridge record errors" items={errors} />}
    </Card>
  );
}

function CheckCard({ check }: { check: PhaserCandidateWrapperBridgeCheck }) {
  return <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{check.label}</h3><StatusPill label={checkLabels[check.status]} tone={checkTones[check.status]} /></div><p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{check.evidence}</p>{check.requiredCorrection && <p className="mt-2 text-xs font-semibold leading-5 text-[var(--tenant-text)]">Next: {check.requiredCorrection}</p>}</article>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p></div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)}</ul></section>;
}
