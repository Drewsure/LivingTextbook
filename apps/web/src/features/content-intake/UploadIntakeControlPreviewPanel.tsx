import { Card, StatusPill } from "@living-textbook/ui";
import type { UploadChannelReadinessPlan } from "@/data/sampleUploadChannelReadiness";
import type { UploadFilePolicyPlan } from "@/data/sampleUploadFilePolicy";

interface UploadIntakeControlPreviewPanelProps {
  channelPlan: UploadChannelReadinessPlan;
  filePolicyPlan: UploadFilePolicyPlan;
}

export function UploadIntakeControlPreviewPanel({
  channelPlan,
  filePolicyPlan,
}: UploadIntakeControlPreviewPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Upload intake control preview</p>
          <h2 className="mt-1 text-lg font-bold">Disabled file intake controls</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This previews the future teacher upload panel shape without rendering a live file input element. Every control stays blocked until storage, scan policy, rights evidence, reviewer identity, and audit records exist.
          </p>
        </div>
        <StatusPill label="No file input element" tone="warning" />
      </div>

      <div className="mt-5 grid gap-4">
        {channelPlan.channels.map((channel) => {
          const filePolicy = filePolicyPlan.profiles.find((profile) => profile.channelId === channel.channelId);

          return (
            <article key={channel.channelId} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{channel.kind}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{channel.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                    Accepted extensions preview: {(filePolicy?.acceptedExtensions ?? channel.acceptedTypes).join(", ")}
                  </p>
                </div>
                <StatusPill label="Blocked" tone="warning" />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ControlPreview label="Selected file" value="None" />
                <ControlPreview label="Source metadata" value="Required" tone="warning" />
                <ControlPreview label="Scan policy" value="Required" tone="warning" />
                <ControlPreview label="Target mapping" value="Required" tone="warning" />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-muted)] opacity-70"
                >
                  Select file blocked
                </button>
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-muted)] opacity-70"
                >
                  Create intake record blocked
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}

function ControlPreview({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
