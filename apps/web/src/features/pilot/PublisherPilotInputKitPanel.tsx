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
    "  --unit-key \"series:book:L1:U1\" `",
    "  --source-file \"source/unit-1.pdf\"",
  ].join("\n");
  const bridgeCommand = [
    "node scripts/create-publisher-source-manifest-from-pilot-kit.mjs `",
    "  --root \"D:\\PublisherPilotInput\"",
  ].join("\n");
  const intakePreflightCommand = [
    "node scripts/publisher-pilot-intake-preflight.mjs `",
    "  --root \"D:\\PublisherPilotInput\" `",
    "  --output \"D:\\PublisherPilotInput\\evidence\\publisher-intake-preflight.json\"",
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
  const saleabilityAuditCommand = "npm run audit:pilot -- --json";
  const saleabilityReportCommand = [
    "npm run audit:pilot -- --json `",
    "  --output \"D:\\PublisherPilotReview\\first-pilot-audit.json\"",
  ].join("\n");
  const saleabilityEvidenceCommand = 'npm run audit:pilot -- --json --human-evidence-root "<external-evidence-folder>"';
  const humanEvidencePacketCommand = [
    "npm run create:pilot-human-evidence -- `",
    "  --root \"D:\\PublisherPilotReview\\human-evidence\" `",
    `  --tenant-id \"${tenantId}\" `,
    "  --package-id \"<reviewed-package-id>\" `",
    "  --unit-key \"series:book:L1:U1\"",
  ].join("\n");
  const packageReviewEvidenceCommand = [
    "node scripts/verify-pilot-package-review-evidence.mjs `",
    "  --path \"D:\\PublisherPilotReview\\human-evidence\\package-review-evidence.json\"",
  ].join("\n");
  const packageReviewBridgeCommand = [
    "node scripts/create-pilot-package-review-evidence-from-record.mjs `",
    "  --source-preflight \"D:\\PublisherPilotInput\\evidence\\publisher-source-preflight.json\" `",
    "  --package-review \"D:\\PublisherPilotReview\\package-evidence-review.json\" `",
    "  --output \"D:\\PublisherPilotReview\\human-evidence\\package-review-evidence.json\" `",
    "  --unit-key \"series:book:L1:U1\" `",
    "  --package-checksum \"sha256:<assembled-package-checksum>\" `",
    "  --game-pathway \"flashcards\" `",
    "  --game-pathway \"memory-match\"",
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

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Durable intake evidence</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Bind the report to the exact brief</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Run this after replacing every placeholder and adding the declared files. The create-once report records the current brief checksum; editing the brief later requires a fresh report before the publisher gate can advance.
            </p>
          </div>
          <StatusPill label="Checksum-bound" tone="success" />
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">PowerShell intake preflight command</p>
          <pre className="whitespace-pre-wrap font-mono">{intakePreflightCommand}</pre>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Boundary label="Creates" value="evidence/publisher-intake-preflight.json" />
          <Boundary label="Binds" value="Current brief checksum and complete inventory" />
          <Boundary label="Still blocked" value="Upload, assembly, QR, persistence, students" />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        <p className="mb-3 font-semibold text-slate-300">PowerShell starter command</p>
        <pre className="whitespace-pre-wrap font-mono">{command}</pre>
        <p className="mt-3 text-xs leading-5 text-slate-300">
          PDF is the default source format. Keep the path under <code>source/</code> and change it to a licensed DOCX, TXT, Markdown, or CSV source when that is the publisher&apos;s authoritative material.
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          Assist languages are optional and tenant-selected. Add <code>--support-languages &quot;ja&quot;</code> only when approved; support text can assist the learner but never triggers progression.
        </p>
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

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Saleability status audit</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Separate platform proof from human gates</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This read-only report shows what the platform has proved and what still needs a real publisher package,
              outside-game evidence, delivery policy, or named release approval. A sample tenant never counts as saleability.
            </p>
          </div>
          <StatusPill label="Read-only" tone="neutral" />
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">Create the external human evidence packet</p>
          <pre className="whitespace-pre-wrap font-mono">{humanEvidencePacketCommand}</pre>
          <p className="mt-3 text-xs leading-5 text-slate-300">This creates incomplete, no-overwrite templates outside the repository. Replace every placeholder and pass its validator before auditing.</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">Package review evidence check</p>
          <pre className="whitespace-pre-wrap font-mono">{packageReviewEvidenceCommand}</pre>
          <p className="mt-3 text-xs leading-5 text-slate-300">The packet must name reviewed content, curated game pathways, audio, video, images, fonts, accessibility, and rights evidence. A lane may be not-applicable only with an explicit evidence reference.</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">Derive the packet from reviewed records</p>
          <pre className="whitespace-pre-wrap font-mono">{packageReviewBridgeCommand}</pre>
          <p className="mt-3 text-xs leading-5 text-slate-300">This create-once bridge derives the source inventory and review identities. It requires the final package checksum and never copies source files, assembles the package, or activates student use.</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">PowerShell audit command</p>
          <pre className="whitespace-pre-wrap font-mono">{saleabilityAuditCommand}</pre>
          <p className="mt-3 text-xs leading-5 text-slate-300">After the human evidence packet exists outside the repository, add its path:</p>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-slate-200">{saleabilityEvidenceCommand}</pre>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <p className="mb-3 font-semibold text-slate-300">PowerShell create-once audit report</p>
          <pre className="whitespace-pre-wrap font-mono">{saleabilityReportCommand}</pre>
          <p className="mt-3 text-xs leading-5 text-slate-300">The report is written outside the repository and records the current source-bound build, proved gates, waiting human inputs, and next actions. It cannot be overwritten and is not itself an approval.</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Boundary label="Proves" value="Build, routes, contracts, operator handoff" />
          <Boundary label="Waits for" value="Publisher, Z.ai, package review, policy, release evidence" />
          <Boundary label="Never does" value="Upload, assemble, print, activate, enable students" />
        </div>
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
