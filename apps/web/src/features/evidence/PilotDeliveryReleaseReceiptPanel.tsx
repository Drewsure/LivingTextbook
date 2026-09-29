import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotDeliveryReleaseReceipt } from "@living-textbook/content-model";

export function PilotDeliveryReleaseReceiptPanel({ receipt, validationErrors }: { receipt: PilotDeliveryReleaseReceipt; validationErrors: string[] }) {
  const approved = receipt.status === "manual-release-approved";
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Manual release receipt</p>
          <h2 className="mt-1 text-lg font-bold">Auditable handoff decision before package writing</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This receipt binds a named reviewer, manifest checksum, QR decision, and rollback reference. It is the last human decision boundary before an approved package can be handed off; it never writes files or activates a student route by itself.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={receipt.status} tone={approved ? "success" : "warning"} />
          <StatusPill label={receipt.mode} tone="neutral" />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={receipt.tenantId} />
        <Fact label="Package" value={receipt.packageId} />
        <Fact label="Reviewer" value={receipt.reviewerId ?? "Not recorded"} />
        <Fact label="Rollback" value={receipt.rollbackReference ?? "Required before release"} />
      </dl>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Fact label="Release approval" value={receipt.releaseApproval} />
        <Fact label="QR print" value={receipt.qrPrintAuthorization} />
        <Fact label="Student activation" value={receipt.studentFacingActivationAllowed ? "Allowed" : "Blocked"} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Fact label="Hosted opt-in packet" value={receipt.hostedPersistenceDecisionPacketId ?? "Not applicable"} />
        <Fact label="Hosted writes" value="Blocked pending separate opt-in" />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Unresolved requirements" items={receipt.unresolvedRequirements} />
        <ListBlock title="Handoff instructions" items={receipt.handoffInstructions} />
      </div>
      <ListBlock title="Protected actions" items={receipt.blockedActions} />
      {validationErrors.length > 0 ? <ListBlock title="Receipt contract findings" items={validationErrors} /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={items.length > 0 ? "warning" : "success"} /></div>{items.length > 0 ? <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul> : <p className="mt-3 text-sm text-[var(--tenant-muted)]">None.</p>}</section>;
}
