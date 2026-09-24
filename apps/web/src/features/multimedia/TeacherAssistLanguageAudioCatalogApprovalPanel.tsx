import { Card, StatusPill } from "@living-textbook/ui";
import type { AssistLanguageAudioCatalogApprovalPacket } from "@living-textbook/content-model";

interface TeacherAssistLanguageAudioCatalogApprovalPanelProps {
  packets: AssistLanguageAudioCatalogApprovalPacket[];
}

export function TeacherAssistLanguageAudioCatalogApprovalPanel({ packets }: TeacherAssistLanguageAudioCatalogApprovalPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Human review boundary</p>
          <h2 className="mt-1 text-xl font-bold">Catalog admission approval is not recorded</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The future teacher or publisher audio owner must review the evidence packet. This foundation surface shows the decision shape but cannot capture a signature or activate an asset.
          </p>
        </div>
        <StatusPill label="No approval captured" tone="warning" />
      </div>

      {packets.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {packets.map((packet) => (
            <article key={packet.approvalPacketId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.tenantId}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.packageId}</h3>
                  <p className="mt-1 text-sm text-[var(--tenant-muted)]">Reviewer: {packet.reviewerRole}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill label={packet.status} tone="warning" />
                  <StatusPill label={packet.decision} tone="warning" />
                </div>
              </div>

              <dl className="mt-4 grid gap-3 text-xs leading-5 sm:grid-cols-2 lg:grid-cols-4">
                <Fact label="Storage record" value={packet.storageRecordName} />
                <Fact label="Catalog records" value={String(packet.catalogRecordIds.length)} />
                <Fact label="Open evidence" value={String(packet.unresolvedEvidence.length)} />
                <Fact label="Side effect" value={packet.sideEffect} />
              </dl>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <List title="Required evidence" items={packet.requiredEvidence} />
                <List title="Next records" items={packet.nextRequiredRecords} />
              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
                Approval allowed: no · Catalog admission allowed: no · Student-facing use: no
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
          No support-audio approval packet is configured for this tenant.
        </p>
      )}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-semibold text-[var(--tenant-text)]">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
      <ul className="mt-2 grid gap-2 text-xs leading-5 text-[var(--tenant-muted)]">
        {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
      </ul>
    </section>
  );
}
