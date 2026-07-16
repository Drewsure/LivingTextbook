import { Card, StatusPill } from "@living-textbook/ui";
import type {
  SchoolPolicyHandoffPacket,
  SchoolPolicyHandoffPacketSection,
  SchoolPolicyHandoffPacketStatus,
} from "@/data/sampleSchoolPolicyHandoffPacket";

interface SchoolPolicyHandoffPacketPanelProps {
  packet: SchoolPolicyHandoffPacket;
}

const statusLabel: Record<SchoolPolicyHandoffPacketStatus, string> = {
  "ready-to-discuss": "Ready to discuss",
  "needs-owner": "Needs owner",
  blocked: "Blocked",
};

const statusTone: Record<SchoolPolicyHandoffPacketStatus, "neutral" | "success" | "warning"> = {
  "ready-to-discuss": "success",
  "needs-owner": "warning",
  blocked: "warning",
};

export function SchoolPolicyHandoffPacketPanel({ packet }: SchoolPolicyHandoffPacketPanelProps) {
  const blockedCount = packet.sections.filter((section) => section.status === "blocked").length;
  const deferredDecisionCount = packet.sections.reduce((count, section) => count + section.decisionsDeferred.length, 0);
  const blockedActionCount = packet.sections.reduce((count, section) => count + section.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">School policy handoff packet</p>
          <h2 className="mt-1 text-lg font-bold">{packet.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={packet.packetStatus} tone="warning" />
          <StatusPill label="No policy acceptance" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <HandoffMetric label="Release candidate" value={packet.releaseCandidate} tone="neutral" />
        <HandoffMetric label="Handoff sections" value={String(packet.sections.length)} tone="neutral" />
        <HandoffMetric label="Blocked sections" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
        <HandoffMetric label="Deferred decisions" value={String(deferredDecisionCount)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              The packet is useful for a school meeting, but it cannot accept policy, capture signatures, create launch
              readiness, export evidence, or unlock a live classroom workflow.
            </p>
          </div>
          <StatusPill label={`${blockedActionCount} blocked actions`} tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {packet.sections.map((section) => (
          <SchoolPolicyHandoffSectionCard key={section.sectionId} section={section} />
        ))}
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Operating rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">School meeting packet boundaries</h3>
          </div>
          <StatusPill label="Discussion only" tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
          {packet.operatingRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function SchoolPolicyHandoffSectionCard({ section }: { section: SchoolPolicyHandoffPacketSection }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {section.audience} / {section.sourceLane}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{section.label}</h3>
        </div>
        <StatusPill label={statusLabel[section.status]} tone={statusTone[section.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{section.discussionPrompt}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <HandoffMiniList title="Evidence needed" items={section.evidenceNeeded} tone="neutral" />
        <HandoffMiniList title="Deferred decisions" items={section.decisionsDeferred} tone="warning" />
        <HandoffMiniList title="Blocked actions" items={section.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function HandoffMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function HandoffMiniList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
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
