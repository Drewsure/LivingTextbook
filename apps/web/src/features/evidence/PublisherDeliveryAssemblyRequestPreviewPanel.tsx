import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherDeliveryAssemblyRequestPreview } from "@living-textbook/content-model";

export function PublisherDeliveryAssemblyRequestPreviewPanel({ preview, validationErrors = [] }: { preview: PublisherDeliveryAssemblyRequestPreview; validationErrors?: string[] }) {
  const present = preview.inputs.filter((item) => item.status === "present").length;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local package assembly request preview</p>
          <h2 className="mt-1 text-lg font-bold">Exact writer inputs, held behind release approval</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This preview makes the eventual closed-local handoff concrete. It lists the identity-bound inputs required by the package writer without accepting a writer request, copying files, creating a QR sheet, activating persistence, or starting students.</p>
        </div>
        <div className="flex flex-wrap gap-2"><StatusPill label="Assembly blocked" tone="warning" /><StatusPill label={`${present}/${preview.inputs.length} inputs`} tone={present === preview.inputs.length ? "success" : "neutral"} /></div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Preview" value={preview.previewId} /><Fact label="Tenant" value={preview.tenantId} /><Fact label="Package" value={preview.packageId} /><Fact label="Delivery mode" value={preview.selectedMode} /><Fact label="Quarantine" value={preview.quarantineId} /><Fact label="Source checksum" value={preview.sourceChecksumSha256} />
      </dl>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {preview.inputs.map((input) => <article key={input.inputId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold">{input.label}</h3><StatusPill label={input.status} tone={input.status === "present" ? "success" : "warning"} /></div><p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{input.evidence}</p><p className="mt-3 border-t border-[var(--tenant-border)] pt-3 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {input.nextAction}</p></article>)}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2"><ListBlock title="Unresolved writer requirements" items={preview.unresolvedRequirements} /><ListBlock title="Protected actions" items={preview.blockedActions} tone="warning" /></div>
      {validationErrors.length > 0 ? <ListBlock title="Assembly preview contract findings" items={validationErrors} tone="warning" /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>; }
function ListBlock({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) { return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>; }
