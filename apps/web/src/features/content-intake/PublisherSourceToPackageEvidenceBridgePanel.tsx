import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherSourceToPackageEvidenceBridge } from "@living-textbook/content-model";

export function PublisherSourceToPackageEvidenceBridgePanel({ bridge }: { bridge: PublisherSourceToPackageEvidenceBridge }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher source-to-package evidence bridge</p>
          <h3 className="mt-1 text-lg font-bold">MiniStar Unit 1 handoff remains review-only</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This bridge joins the real source review, extraction preview, sentence proposal, audio, media, game, and release lanes. It makes the next human decisions visible without creating a draft, writing a package, generating QR codes, or opening student access.
          </p>
        </div>
        <StatusPill label="Blocked / no side effects" tone="warning" />
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Unit" value={bridge.unitKey} />
        <Fact label="Source review" value={bridge.sourceReviewId} />
        <Fact label="Extraction preview" value={bridge.extractionPreviewId} />
        <Fact label="Open evidence gaps" value={String(bridge.missingEvidence.length)} />
      </dl>
      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Checksum-bound lineage</p>
        <p className="mt-2 break-all font-mono text-xs text-[var(--tenant-muted)]">{bridge.sourceChecksum}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">The authored sentences are linked for review but are explicitly not represented as extracted source content.</p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {bridge.evidenceLanes.map((lane) => (
          <section key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h4>
              <StatusPill label={lane.status} tone={lane.status === "present" ? "success" : "warning"} />
            </div>
            <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{lane.identity}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.details}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {lane.nextAction}</p>
          </section>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusPill label="Draft creation blocked" tone="warning" />
        <StatusPill label="Package assembly blocked" tone="warning" />
        <StatusPill label="QR printing blocked" tone="warning" />
        <StatusPill label="Student use blocked" tone="warning" />
      </div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></section>;
}
