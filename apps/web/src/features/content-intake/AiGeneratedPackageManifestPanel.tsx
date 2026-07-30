import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratedPackageManifest,
  AiGeneratedPackageManifestRecordStatus,
  AiGeneratedPackageManifestStatus,
} from "@/data/sampleAiGeneratedPackageManifest";

interface AiGeneratedPackageManifestPanelProps {
  manifests: AiGeneratedPackageManifest[];
}

const manifestStatusTone: Record<AiGeneratedPackageManifestStatus, "neutral" | "warning"> = {
  "manifest-preview": "neutral",
  blocked: "warning",
};

const recordStatusTone: Record<AiGeneratedPackageManifestRecordStatus, "neutral" | "success" | "warning"> = {
  "ready-preview": "success",
  "blocked-preview": "warning",
  missing: "warning",
};

export function AiGeneratedPackageManifestPanel({ manifests }: AiGeneratedPackageManifestPanelProps) {
  const releaseLockCount = manifests.reduce((total, manifest) => total + manifest.releaseLocks.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generated package manifest</p>
          <h2 className="mt-1 text-lg font-bold">One bundle, many gates</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The manifest is the future package assembly target. It links the generator request, prompt, draft JSON, audio,
            engine, reward, verifier, and review queue evidence before any storage write or student-facing route exists.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Package assembly blocked" tone="warning" />
          <StatusPill label={`${releaseLockCount} release lock(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {manifests.map((manifest) => (
          <article key={manifest.manifestId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{manifest.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{manifest.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{manifest.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={manifest.status} tone={manifestStatusTone[manifest.status]} />
                <StatusPill label={manifest.assemblyState} tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.2fr]">
              <ManifestList title="Manifest links" items={manifest.links.map((link) => `${link.label}: ${link.recordId} - ${link.purpose}`)} />
              <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[var(--tenant-text)]">Package records</h4>
                  <StatusPill label={String(manifest.records.length)} tone="warning" />
                </div>
                <div className="mt-3 grid gap-3">
                  {manifest.records.map((record) => (
                    <ManifestRecordCard key={record.recordType} record={record} />
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ManifestList title="Assembly steps" items={manifest.assemblySteps} />
              <ManifestList title="Release locks" items={manifest.releaseLocks} tone="warning" />
              <ManifestList title="Blocked package actions" items={manifest.blockedActions} tone="warning" />
              <ManifestList title="Next requirements" items={manifest.nextRequirements} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ManifestRecordCard({ record }: { record: AiGeneratedPackageManifest["records"][number] }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.recordType}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{record.label}</h5>
        </div>
        <StatusPill label={record.status} tone={recordStatusTone[record.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Source</dt>
          <dd>{record.source}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Blocker</dt>
          <dd>{record.blocker}</dd>
        </div>
      </dl>
    </article>
  );
}

function ManifestList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
