import { Card, StatusPill } from "@living-textbook/ui";

interface PublisherPilotInputKitPanelProps {
  tenantId: string;
  tenantName: string;
}

export function PublisherPilotInputKitPanel({ tenantId, tenantName }: PublisherPilotInputKitPanelProps) {
  const command = [
    "node scripts/create-publisher-pilot-intake-kit.mjs `",
    `  --root \"D:\\PublisherPilotInput\" `,
    `  --tenant-id \"${tenantId}\" `,
    `  --publisher-name \"${tenantName}\" `,
    "  --book-title \"Book Title\" `",
    "  --unit-key \"series:book:L1:U1\"",
  ].join("\n");
  const bridgeCommand = [
    "node scripts/create-publisher-source-manifest-from-pilot-kit.mjs `",
    "  --root \"D:\\PublisherPilotInput\"",
  ].join("\n");
  const evidenceRequestCommand = [
    "node scripts/create-publisher-source-preflight-evidence-request.mjs `",
    "  --root \"D:\\PublisherPilotInput\" `",
    "  --output \"D:\\PublisherPilotReview\\source-preflight-evidence-request.json\" `",
    `  --tenant \"${tenantId}\" `,
    "  --quarantine \"q-<authorized-quarantine-uuid>\"",
  ].join("\n");
  const evidenceSubmitCommand = [
    "$env:LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN = \"<server-side-token>\"",
    "node scripts/submit-publisher-source-preflight-evidence-request.mjs `",
    "  --request \"D:\\PublisherPilotReview\\source-preflight-evidence-request.json\" `",
    "  --base-url \"http://127.0.0.1:3000\"",
  ].join("\n");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher pilot input kit</p>
          <h2 className="mt-1 text-lg font-bold">Prepare the first real publisher handoff</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            Create one private folder for the textbook source, images, audio, video, transcripts, fonts, and optional
            background media. This is a metadata-only starter; it does not upload, assemble, publish, print QR codes,
            enable persistence, or expose students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="No overwrite" tone="neutral" />
          <StatusPill label="White-label" tone="success" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <KitStep number="1" title="Create privately" detail="Keep publisher-owned files outside the repository and use one kit per submission." />
        <KitStep number="2" title="Replace placeholders" detail="Add the real edition, rights owner, unit, QR page, and policy details." />
        <KitStep number="3" title="Preflight the intake" detail="Inventory the completed kit and preserve the create-once evidence report." />
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        <p className="mb-3 font-semibold text-slate-300">PowerShell starter command</p>
        <pre className="whitespace-pre-wrap font-mono">{command}</pre>
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Canonical handoff</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Bridge the completed kit to source review</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              After the intake preflight is complete, this create-once command generates the canonical source manifest used by the review system. It does not copy, upload, assemble, print, activate, or open student access.
            </p>
          </div>
          <StatusPill label="Create once" tone="neutral" />
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">PowerShell bridge command</p>
          <pre className="whitespace-pre-wrap font-mono">{bridgeCommand}</pre>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Boundary label="Creates" value="Canonical source manifest only" />
          <Boundary label="Next gate" value="MIME-aware source preflight" />
          <Boundary label="Still blocked" value="Upload, assembly, QR, persistence, students" />
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source evidence request</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Prepare the tenant-bound preflight handoff</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              After the canonical preflight passes, create one metadata-only request for the authorized quarantine record. The quarantine UUID must come from the intake system; do not invent or reuse one from another tenant.
            </p>
          </div>
          <StatusPill label="Metadata only" tone="neutral" />
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">PowerShell evidence request command</p>
          <pre className="whitespace-pre-wrap font-mono">{evidenceRequestCommand}</pre>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Boundary label="Creates" value="Create-once evidence request" />
          <Boundary label="Requires" value="Authorized quarantine and matching checksum" />
          <Boundary label="Still blocked" value="Raw upload, assembly, QR, persistence, students" />
        </div>
        <div className="mt-5 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">PowerShell submission command</p>
          <pre className="whitespace-pre-wrap font-mono">{evidenceSubmitCommand}</pre>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
          The token is supplied only through the operator environment. The submitter sends tenant, quarantine, package,
          and preflight report metadata; it never sends raw files or protected-action flags.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Boundary label="Creates" value="Brief and media folder scaffold" />
        <Boundary label="Next gate" value="Source preflight and rights review" />
        <Boundary label="Still blocked" value="Assembly, QR, persistence, students" />
      </div>
    </Card>
  );
}

function KitStep({ number, title, detail }: { number: string; title: string; detail: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-[var(--tenant-primary)] text-sm font-bold text-[var(--tenant-primary-text)]">{number}</span>
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{detail}</p>
    </section>
  );
}

function Boundary({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
