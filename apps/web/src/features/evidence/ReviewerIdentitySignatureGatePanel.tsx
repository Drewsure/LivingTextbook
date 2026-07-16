import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ReviewerIdentitySignatureGate,
  ReviewerIdentitySignatureLane,
  ReviewerIdentitySignatureLaneStatus,
} from "@/data/sampleReviewerIdentitySignatureGate";

interface ReviewerIdentitySignatureGatePanelProps {
  gate: ReviewerIdentitySignatureGate;
}

const laneTone: Record<ReviewerIdentitySignatureLaneStatus, "neutral" | "warning"> = {
  blocked: "warning",
  planned: "neutral",
};

export function ReviewerIdentitySignatureGatePanel({ gate }: ReviewerIdentitySignatureGatePanelProps) {
  const blockedLaneCount = gate.lanes.filter((lane) => lane.status === "blocked").length;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Approval identity readiness</p>
            <h2 className="mt-1 text-2xl font-bold">{gate.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label={gate.identityStatus} tone="warning" />
            <StatusPill label={gate.signatureStatus} tone="warning" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Approval lanes" value={String(gate.lanes.length)} />
          <Metric label="Blocked lanes" value={String(blockedLaneCount)} tone="warning" />
          <Metric label="Approval status" value={gate.approvalCaptureStatus} tone="warning" />
          <Metric label="Blocked actions" value={String(gate.blockedActions.length)} tone="warning" />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <RouteLink label="Evidence route" href={gate.evidenceRoute} />
          <RouteLink label="Handoff route" href={gate.handoffRoute} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Identity and approval lanes</p>
            <h3 className="mt-1 text-lg font-bold">Required before signed approval capture can exist</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These lanes define who can approve, what they are approving, and why the approval controls stay disabled.
            </p>
          </div>
          <StatusPill label="Review-only" tone="warning" />
        </div>

        <div className="mt-5 grid gap-4">
          {gate.lanes.map((lane) => (
            <LaneCard key={lane.laneId} lane={lane} />
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Minimum approval record</p>
              <h3 className="mt-1 text-lg font-bold">Fields required before approval persistence</h3>
            </div>
            <StatusPill label={String(gate.minimumApprovalRecord.length)} tone="warning" />
          </div>
          <ListBlock items={gate.minimumApprovalRecord} />
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Signature policy rules</p>
              <h3 className="mt-1 text-lg font-bold">Approval cannot bypass evidence</h3>
            </div>
            <StatusPill label="Hard gate" tone="warning" />
          </div>
          <ListBlock title="Policy rules" items={gate.policyRules} />
          <ListBlock title="Blocked actions" items={gate.blockedActions} />
        </Card>
      </div>
    </div>
  );
}

function LaneCard({ lane }: { lane: ReviewerIdentitySignatureLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.laneId}</p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h4>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">Owner: {lane.ownerRole}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.purpose}</p>
        </div>
        <StatusPill label={lane.status} tone={laneTone[lane.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <ListBlock title="Required before approval" items={lane.requiredBeforeApproval} />
        <ListBlock title="Blocked actions" items={lane.blockedActions} />
      </div>
    </article>
  );
}

function RouteLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3 text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
    >
      {label}: {href}
    </a>
  );
}

function ListBlock({ title, items }: { title?: string; items: string[] }) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      {title ? <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4> : null}
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
