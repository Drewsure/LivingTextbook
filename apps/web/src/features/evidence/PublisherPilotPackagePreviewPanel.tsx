import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PublisherPilotPackageArtifact,
  PublisherPilotPackagePreview,
  PublisherPilotQrPreview,
} from "@living-textbook/content-model";

interface PublisherPilotPackagePreviewPanelProps {
  preview: PublisherPilotPackagePreview;
  validationErrors: string[];
}

const artifactTone = { "preview-ready": "success", blocked: "warning" } as const;

export function PublisherPilotPackagePreviewPanel({ preview, validationErrors }: PublisherPilotPackagePreviewPanelProps) {
  const previewReady = preview.artifacts.filter((artifact) => artifact.status === "preview-ready").length;
  const blocked = preview.artifacts.filter((artifact) => artifact.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher package assembly preview</p>
          <h2 className="mt-1 text-2xl font-bold">{preview.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is the first saleable-pilot package map: reviewed textbook content, curated games, multimedia, stable QR aliases, local fallback, and optional hosted persistence in one tenant-scoped preview. It is not a release archive and does not authorize printing or student use.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={preview.status} tone="warning" />
          <StatusPill label="Review-only" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={preview.tenantId} />
        <Fact label="Package" value={preview.packageId} />
        <Fact label="Version" value={preview.version} />
        <Fact label="Source decision" value={preview.sourceReviewDecision} />
      </dl>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Artifacts" value={String(preview.artifacts.length)} />
        <Metric label="Preview-ready" value={String(previewReady)} tone="success" />
        <Metric label="Blocked" value={String(blocked)} tone="warning" />
        <Metric label="Games" value={String(preview.gameModes.length)} />
        <Metric label="QR previews" value={String(preview.qrPreviews.length)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Deployment choice</p>
            <h3 className="mt-1 text-base font-bold">One package, three supported delivery shapes</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              The same reviewed package can later target a hosted PWA, a closed local companion, or a hybrid front door. Hosted persistence remains opt-in and is not silently enabled by package assembly.
            </p>
          </div>
          <StatusPill label={preview.hostedPersistence} tone="warning" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {preview.deploymentOptions.map((option) => <StatusPill key={option} label={option} tone="neutral" />)}
        </div>
      </section>

      <section className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Package artifact map</p>
            <h3 className="mt-1 text-lg font-bold">What the publisher will receive after review</h3>
          </div>
          <StatusPill label="Writes blocked" tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {preview.artifacts.map((artifact) => <ArtifactCard key={artifact.artifactId} artifact={artifact} />)}
        </div>
      </section>

      <section className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">QR print map</p>
            <h3 className="mt-1 text-lg font-bold">Stable aliases first; production printing later</h3>
          </div>
          <StatusPill label="Print authorization blocked" tone="warning" />
        </div>
        <div className="mt-4 grid gap-3">
          {preview.qrPreviews.map((qr) => <QrCard key={qr.printedQrId} qr={qr} />)}
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Game modes in this preview" items={preview.gameModes} />
        <ListBlock title="Multimedia channels" items={preview.mediaKinds.map((kind) => `${kind} · reviewed asset lane required`)} />
        <ListBlock title="Next gates" items={preview.nextGates} />
        <ListBlock title="Blocked actions" items={preview.blockedActions} tone="warning" />
      </div>

      {validationErrors.length > 0 ? <ListBlock title="Contract findings" items={validationErrors} tone="warning" /> : null}
    </Card>
  );
}

function ArtifactCard({ artifact }: { artifact: PublisherPilotPackageArtifact }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{artifact.kind}</p>
          <h4 className="mt-1 text-base font-bold">{artifact.label}</h4>
          <p className="mt-1 break-words text-xs text-[var(--tenant-muted)]">{artifact.proposedPath}</p>
        </div>
        <StatusPill label={artifact.status} tone={artifactTone[artifact.status]} />
      </div>
      <p className="mt-3 text-xs text-[var(--tenant-muted)]">Source records: {artifact.sourceRecords.join(" · ")}</p>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {artifact.missingEvidence.map((item) => <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">Missing: {item}</li>)}
      </ul>
    </article>
  );
}

function QrCard({ qr }: { qr: PublisherPilotQrPreview }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold">{qr.targetLabel}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{qr.printedQrId}</p>
        </div>
        <StatusPill label={qr.status} tone="warning" />
      </div>
      <a href={qr.aliasPath} className="mt-3 block break-all text-xs font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4">Alias preview: {qr.aliasPath}</a>
      <p className="mt-2 text-xs text-[var(--tenant-muted)]">Local fallback: {qr.fallbackPath}</p>
      <div className="mt-3 flex flex-wrap gap-2">{qr.deploymentTargets.map((target) => <StatusPill key={target} label={target} tone="neutral" />)}<StatusPill label="Print blocked" tone="warning" /></div>
    </article>
  );
}

function ListBlock({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={tone} /></div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "success" | "warning" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><StatusPill label={tone === "success" ? "Ready" : tone === "warning" ? "Gate" : "Info"} tone={tone} /></div><p className="mt-2 text-sm font-bold">{value}</p></section>;
}
