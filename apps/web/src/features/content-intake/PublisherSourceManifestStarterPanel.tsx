import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherSubmissionManifest } from "@living-textbook/content-model";

const suggestedPaths: Record<PublisherSubmissionManifest["assets"][number]["kind"], string> = {
  "textbook-source": "unit-1/source.pdf",
  image: "unit-1/diagram.png",
  audio: "unit-1/greetings.mp3",
  video: "unit-1/lesson.mp4",
  transcript: "unit-1/lesson.vtt",
  font: "unit-1/learner-font.woff2",
  "background-media": "unit-1/game-background.mp3",
};

export function PublisherSourceManifestStarterPanel({ manifest }: { manifest: PublisherSubmissionManifest }) {
  const source = manifest.assets.find((asset) => asset.kind === "textbook-source");
  const unitKey = source?.unitKey ?? `${manifest.tenantId}:pilot:L1:U1`;
  const command = [
    "node scripts/create-publisher-source-manifest.mjs `",
    `  --root \"D:\\PublisherPackage\" `,
    `  --tenant-id \"${manifest.tenantId}\" `,
    `  --package-id \"${manifest.packageId}\" `,
    `  --version \"2026.10.01\" `,
    `  --unit-key \"${unitKey}\" `,
    `  --source \"${suggestedPaths["textbook-source"]}\" `,
    ...manifest.assets
      .filter((asset) => asset.kind !== "textbook-source")
      .map((asset) => `  --asset \"${asset.kind}=${suggestedPaths[asset.kind]}\" `),
  ].join("\n");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher intake starter</p>
          <h2 className="mt-1 text-lg font-bold">Prepare one complete Unit 1 source folder</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            Use this repeatable folder shape for the textbook source and its optional image, audio, video, transcript,
            font, and game-background lanes. It creates a declaration only; the real files remain with the publisher
            until the controlled quarantine gate is enabled.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Starter only" tone="neutral" />
          <StatusPill label="No overwrite" tone="warning" />
          <StatusPill label="Review required" tone="warning" />
        </div>
      </div>

      <ol className="mt-5 grid gap-3 md:grid-cols-3">
        <Step number="1" title="Create a private folder" detail="Keep publisher-owned files outside this repository and use one folder per submission." />
        <Step number="2" title="Create the declaration" detail="Run the command below, then place files at exactly the declared relative paths." />
        <Step number="3" title="Run source preflight" detail="Preserve the report fingerprints and attach only reviewed metadata to quarantine." />
      </ol>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        <p className="mb-3 font-semibold text-slate-300">PowerShell starter command</p>
        <pre className="whitespace-pre-wrap font-mono">{command}</pre>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Boundary label="Creates" value="publisher-source-manifest.json only" />
        <Boundary label="Next command" value="preflight:publisher-source" />
        <Boundary label="Still blocked" value="Promotion, QR, persistence, students" />
      </div>
    </Card>
  );
}

function Step({ number, title, detail }: { number: string; title: string; detail: string }) {
  return (
    <li className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-[var(--tenant-primary)] text-sm font-bold text-[var(--tenant-primary-text)]">{number}</span>
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{detail}</p>
    </li>
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
