import { Card, StatusPill } from "@living-textbook/ui";
import type {
  UploadFilePolicyPlan,
  UploadFilePolicyProfile,
  UploadFilePolicyStatus,
} from "@/data/sampleUploadFilePolicy";

interface UploadFilePolicyPanelProps {
  plan: UploadFilePolicyPlan;
}

const statusTone: Record<UploadFilePolicyStatus, "neutral" | "warning"> = {
  planned: "neutral",
  "blocked-preview": "warning",
};

export function UploadFilePolicyPanel({ plan }: UploadFilePolicyPanelProps) {
  const blockedCount = plan.profiles.filter((profile) => profile.status === "blocked-preview").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">File type and size policy</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tenant-text)]">Hard rules</h3>
            <StatusPill label={String(plan.hardRules.length)} tone="warning" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {plan.hardRules.map((rule) => (
              <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tenant-text)]">Required records</h3>
            <StatusPill label={String(plan.requiredRecords.length)} tone="warning" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {plan.requiredRecords.map((record) => (
              <li key={record} className="rounded-lg border border-[var(--tenant-border)] p-3">
                {record}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-5 grid gap-4">
        {plan.profiles.map((profile) => (
          <FilePolicyProfileCard key={profile.profileId} profile={profile} />
        ))}
      </div>
    </Card>
  );
}

function FilePolicyProfileCard({ profile }: { profile: UploadFilePolicyProfile }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{profile.channelId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{profile.label}</h3>
        </div>
        <StatusPill label={profile.status} tone={statusTone[profile.status]} />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3 xl:grid-cols-5">
        <FilePolicyList title="Accepted extensions" items={profile.acceptedExtensions} tone="neutral" />
        <FilePolicyList title="Accepted MIME types" items={profile.acceptedMimeTypes} tone="neutral" />
        <FilePolicyList title="Maximums required" items={profile.maximums} tone="warning" />
        <FilePolicyList title="Required checks" items={profile.requiredChecks} tone="warning" />
        <FilePolicyList title="Blocked shortcuts" items={profile.blockedShortcuts} tone="warning" />
      </div>
      <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next gate</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{profile.nextGate}</p>
      </section>
    </article>
  );
}

function FilePolicyList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
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
