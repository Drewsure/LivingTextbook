import { Card, StatusPill } from "@living-textbook/ui";
import type { PackageApprovalLedger } from "@/data/samplePackageApprovalLedger";
import type { PackagePublishGate } from "@/data/samplePackagePublishGate";

interface PilotReleaseCandidatePanelProps {
  gate: PackagePublishGate;
  ledger: PackageApprovalLedger;
}

export function PilotReleaseCandidatePanel({ gate, ledger }: PilotReleaseCandidatePanelProps) {
  const blockingGateCount = gate.items.filter((item) => item.blocksRelease && item.status !== "ready").length;
  const requiredApprovalOpenCount = ledger.signoffs.filter(
    (signoff) => signoff.requiredBeforePilot && signoff.status !== "signed",
  ).length;
  const isPilotReady = blockingGateCount === 0 && requiredApprovalOpenCount === 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot release candidate</p>
          <h2 className="mt-1 text-lg font-bold">{gate.releaseCandidate}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This summary joins the publish gate and approval ledger into one release-control view. It is a review surface for the first partner pilot, not a production publish button.
          </p>
        </div>
        <StatusPill label={isPilotReady ? "Pilot ready" : "Do not publish yet"} tone={isPilotReady ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReleaseMetric label="Tenant" value={gate.tenantId} tone="neutral" />
        <ReleaseMetric label="Package" value={gate.packageId} tone="neutral" />
        <ReleaseMetric label="Open gates" value={String(blockingGateCount)} tone={blockingGateCount > 0 ? "warning" : "success"} />
        <ReleaseMetric label="Open approvals" value={String(requiredApprovalOpenCount)} tone={requiredApprovalOpenCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release-control rule</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              A candidate can become a live pilot only when every release-blocking gate is ready and every required approval is signed. Demo routes may remain visible while this status is open.
            </p>
          </div>
          <StatusPill label="Backend agnostic" tone="success" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ReleaseList
          title="Blocking gates still open"
          emptyLabel="No release-blocking gates are open."
          items={gate.items
            .filter((item) => item.blocksRelease && item.status !== "ready")
            .map((item) => `${item.label}: ${item.nextStep}`)}
        />
        <ReleaseList
          title="Required approvals still open"
          emptyLabel="No required approvals are open."
          items={ledger.signoffs
            .filter((signoff) => signoff.requiredBeforePilot && signoff.status !== "signed")
            .map((signoff) => `${signoff.label}: ${signoff.nextStep}`)}
        />
      </div>
    </Card>
  );
}

function ReleaseMetric({
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

function ReleaseList({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: string[];
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={items.length > 0 ? "warning" : "success"} />
      </div>
      {items.length > 0 ? (
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{emptyLabel}</p>
      )}
    </section>
  );
}
