import { Card, StatusPill } from "@living-textbook/ui";
import type {
  UploadChannel,
  UploadChannelReadinessPlan,
  UploadChannelRequirement,
  UploadChannelStatus,
  UploadChannelTarget,
} from "@/data/sampleUploadChannelReadiness";

interface UploadChannelReadinessPanelProps {
  plan: UploadChannelReadinessPlan;
}

const statusTone: Record<UploadChannelStatus, "neutral" | "warning"> = {
  planned: "neutral",
  "blocked-preview": "warning",
  "policy-required": "warning",
};

const requirementTone: Record<UploadChannelRequirement["status"], "neutral" | "warning"> = {
  required: "neutral",
  blocked: "warning",
  future: "neutral",
};

export function UploadChannelReadinessPanel({ plan }: UploadChannelReadinessPanelProps) {
  const blockedCount = plan.channels.filter((channel) => channel.status !== "planned").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Upload channel readiness</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} gated`} tone={blockedCount > 0 ? "warning" : "neutral"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Foundation rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.foundationRule}</p>
      </section>

      <div className="mt-5 grid gap-4">
        {plan.channels.map((channel) => (
          <UploadChannelCard key={channel.channelId} channel={channel} />
        ))}
      </div>
    </Card>
  );
}

function UploadChannelCard({ channel }: { channel: UploadChannel }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{channel.kind}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{channel.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{channel.maxFilePolicy}</p>
        </div>
        <StatusPill label={channel.status} tone={statusTone[channel.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <UploadList title="Accepted file types" items={channel.acceptedTypes} tone="neutral" />
        <UploadTargetsList targets={channel.targets} />
        <UploadList title="Blocked by" items={channel.blockedBy} tone="warning" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="grid gap-3">
          {channel.requirements.map((requirement) => (
            <UploadRequirementCard key={requirement.requirementId} requirement={requirement} />
          ))}
        </div>
        <UploadList title="Not allowed yet" items={channel.notAllowedYet} tone="warning" />
      </div>
    </article>
  );
}

function UploadRequirementCard({ requirement }: { requirement: UploadChannelRequirement }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{requirement.label}</h4>
        <StatusPill label={requirement.status} tone={requirementTone[requirement.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{requirement.detail}</p>
    </section>
  );
}

function UploadTargetsList({ targets }: { targets: UploadChannelTarget[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">Upload targets</h4>
        <StatusPill label={String(targets.length)} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-3">
        {targets.map((target) => (
          <article key={target.targetId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
            <p className="text-sm font-bold text-[var(--tenant-text)]">{target.label}</p>
            <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{target.targetType}</p>
            <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
              {target.requiredReview.map((item, index) => (
                <li key={`${target.targetId}-required-review-${index}-${item}`}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function UploadList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
