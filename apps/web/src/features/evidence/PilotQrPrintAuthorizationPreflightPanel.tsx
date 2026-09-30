import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotQrPrintAuthorizationPreflight } from "@living-textbook/content-model";

export function PilotQrPrintAuthorizationPreflightPanel({
  preflight,
  validationErrors,
}: {
  preflight: PilotQrPrintAuthorizationPreflight;
  validationErrors: string[];
}) {
  const ready = preflight.status === "ready-for-authorization";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">QR print authorization preflight</p>
          <h2 className="mt-1 text-lg font-bold">A controlled decision before any production print</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preflight reconciles the exact package, release receipt, checksum, alias registry, fallback paths, and rollback evidence. It can prepare a human decision, but it never prints, writes a registry, changes a route, or activates students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={ready ? "Ready for authorization" : "Blocked"} tone={ready ? "success" : "warning"} />
          <StatusPill label="Print remains disabled" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Preflight" value={preflight.preflightId} />
        <Fact label="Package" value={`${preflight.packageId} · ${preflight.version}`} />
        <Fact label="Aliases" value={String(preflight.aliasCount)} />
        <Fact label="Artifact" value={preflight.printArtifactId} />
      </dl>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Decision label="Authorization" value="Pending human decision" tone="warning" />
        <Decision label="Print artifact" value="Blocked" tone="warning" />
        <Decision label="Route mutation" value="Blocked" tone="warning" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Remaining gates" items={preflight.unresolvedRequirements} />
        <ListBlock title="Always blocked from this preview" items={preflight.blockedActions} />
      </div>

      {validationErrors.length > 0 ? <ListBlock title="Preflight contract findings" items={validationErrors} /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}

function Decision({ label, value, tone }: { label: string; value: string; tone: "warning" | "success" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><StatusPill label={tone === "success" ? "Ready" : "Gate"} tone={tone} /></div><p className="mt-2 text-sm font-bold">{value}</p></section>;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold">{title}</h3><StatusPill label={String(items.length)} tone="warning" /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>;
}
