import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotDeliveryGateSnapshot, PilotDeliveryManifest } from "@living-textbook/content-model";

export function PilotDeliveryManifestPanel({ manifest, validationErrors }: { manifest: PilotDeliveryManifest; validationErrors: string[] }) {
  const gateEntries = Object.entries(manifest.gates) as Array<[keyof PilotDeliveryGateSnapshot, boolean]>;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot delivery manifest</p>
          <h2 className="mt-1 text-lg font-bold">One governed handoff for package, QR, and deployment</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This manifest is the final pre-writer boundary. It joins the reviewed content/game/media package to QR printing, local delivery, or opt-in hosted persistence. It cannot write files or activate students by itself.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={manifest.status} tone={manifest.status === "ready-for-manual-release" ? "success" : "warning"} />
          <StatusPill label={manifest.mode} tone="neutral" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={manifest.tenantId} />
        <Fact label="Package" value={manifest.packageId} />
        <Fact label="Version" value={manifest.version} />
        <Fact label="Hosted persistence" value={manifest.hostedPersistence} />
        <Fact label="Opt-in packet" value={manifest.hostedPersistenceDecisionPacketId ?? "Not applicable"} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Gate composition</p>
            <h3 className="mt-1 text-base font-bold">Every lane must agree before manual release</h3>
          </div>
          <StatusPill label={`${gateEntries.filter(([, ready]) => ready).length}/${gateEntries.length} closed`} tone={gateEntries.every(([, ready]) => ready) ? "success" : "warning"} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {gateEntries.map(([gate, ready]) => (
            <div key={gate} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              <span className="text-sm font-semibold">{labelize(gate)}</span>
              <StatusPill label={ready ? "Closed" : "Open"} tone={ready ? "success" : "warning"} />
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Fact label="Delivery" value={manifest.deliveryAllowed ? "Allowed for manual release" : "Blocked"} />
        <Fact label="QR printing" value={manifest.qrPrintAllowed ? "Authorized" : "Blocked"} />
        <Fact label="Student activation" value={manifest.studentFacingActivationAllowed ? "Approved" : "Blocked"} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Unresolved requirements" items={manifest.unresolvedRequirements} tone="warning" />
        <ListBlock title="Blocked actions" items={manifest.blockedActions} tone="warning" />
      </div>

      {validationErrors.length > 0 ? <ListBlock title="Manifest contract findings" items={validationErrors} tone="warning" /> : null}
    </Card>
  );
}

function labelize(value: string): string {
  return value.replaceAll(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase());
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "neutral" | "warning" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={tone} /></div>{items.length > 0 ? <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul> : <p className="mt-3 text-sm text-[var(--tenant-muted)]">None.</p>}</section>;
}
