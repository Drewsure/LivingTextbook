import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherDeliveryClosurePacket } from "@living-textbook/content-model";

export function PublisherDeliveryClosurePacketPanel({ packet, validationErrors = [] }: { packet: PublisherDeliveryClosurePacket; validationErrors?: string[] }) {
  const passed = packet.checks.filter((check) => check.status === "passed").length;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher delivery closure packet</p>
          <h2 className="mt-1 text-lg font-bold">One identity packet for the eventual release operator</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This packet is assembled from the live quarantine evidence and keeps the final release decision in one place. It is not an approval and cannot write a receipt, assemble files, print QR codes, activate persistence, or assign students.</p>
        </div>
        <div className="flex flex-wrap gap-2"><StatusPill label="Blocked" tone="warning" /><StatusPill label={`${passed}/${packet.checks.length} checks`} tone="neutral" /></div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Packet" value={packet.packetId} />
        <Fact label="Tenant" value={packet.tenantId} />
        <Fact label="Package" value={packet.packageId} />
        <Fact label="Delivery mode" value={packet.selectedMode} />
        <Fact label="Source" value={packet.sourceId} />
        <Fact label="Checksum" value={packet.sourceChecksumSha256} />
      </dl>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {packet.checks.map((check) => <article key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-bold">{check.label}</h3><StatusPill label={check.status} tone={check.status === "passed" ? "success" : "warning"} /></div><p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.evidence}</p><p className="mt-3 border-t border-[var(--tenant-border)] pt-3 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {check.nextAction}</p></article>)}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2"><ListBlock title="Required human inputs" items={packet.requiredHumanInputs} /><ListBlock title="Protected actions" items={packet.blockedActions} tone="warning" /></div>
      {validationErrors.length > 0 ? <ListBlock title="Closure packet contract findings" items={validationErrors} tone="warning" /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>; }
function ListBlock({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) { return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>; }
