import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageTeacherReviewPacketCollectionWarnings,
  validateAiGeneratedPackageTeacherReviewPackets,
} from "@living-textbook/content-model/src/aiGeneratedPackageTeacherReviewPacket";

import type {
  AiGeneratedPackageTeacherReviewLaneStatus,
  AiGeneratedPackageTeacherReviewPacket,
  AiGeneratedPackageTeacherReviewPacketStatus,
} from "@/data/sampleAiGeneratedPackageTeacherReviewPacket";

interface AiGeneratedPackageTeacherReviewPacketPanelProps {
  packets: AiGeneratedPackageTeacherReviewPacket[];
}

const packetStatusTone: Record<AiGeneratedPackageTeacherReviewPacketStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-teacher-review": "success",
};

const laneStatusTone: Record<AiGeneratedPackageTeacherReviewLaneStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "needs-evidence": "warning",
  "review-ready": "success",
  "accepted-preview": "success",
};

export function AiGeneratedPackageTeacherReviewPacketPanel({
  packets,
}: AiGeneratedPackageTeacherReviewPacketPanelProps) {
  const guardBlocks = validateAiGeneratedPackageTeacherReviewPackets(packets);
  const guardWarnings = getAiGeneratedPackageTeacherReviewPacketCollectionWarnings(packets);
  const missingEvidenceCount = packets.reduce((total, packet) => total + packet.missingEvidence.length, 0);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package teacher review packet
          </p>
          <h2 className="mt-1 text-lg font-bold">Teacher approval prep</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet gathers generated content, target-language audio, curated activities, deterministic rewards,
            media evidence, support-language boundaries, and verifier blockers into one teacher-facing approval-prep
            surface.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Teacher review packet guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No teacher approval capture" tone="warning" />
          <StatusPill label={`${missingEvidenceCount} missing evidence item(s)`} tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListPanel
          title="Teacher review packet guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared teacher review packet guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ListPanel
          title="Teacher review packet guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared teacher review packet guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <StatusPill label={packet.status} tone={packetStatusTone[packet.status]} />
            </div>

            <section className="mt-4 rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Teacher decision lanes</p>
                <StatusPill label={String(packet.decisionLanes.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {packet.decisionLanes.map((lane) => (
                  <DecisionLaneCard key={`${packet.packetId}-${lane.label}`} lane={lane} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ListPanel title="Ready signals" items={packet.readySignals} tone="success" />
              <ListPanel title="Missing evidence" items={packet.missingEvidence} tone="warning" />
              <ListPanel title="Blocked actions" items={packet.blockedActions} tone="warning" />
              <ListPanel title="Next required records" items={packet.nextRequiredRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function DecisionLaneCard({ lane }: { lane: AiGeneratedPackageTeacherReviewPacket["decisionLanes"][number] }) {
  return (
    <article className="rounded-md border border-[var(--tenant-border)] bg-white/90 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h4>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.sourceRecord}</p>
        </div>
        <StatusPill label={lane.status} tone={laneStatusTone[lane.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <ReviewFact label="Evidence" value={lane.evidence} />
        <ReviewFact label="Teacher question" value={lane.teacherQuestion} />
        <ReviewFact label="Blocker" value={lane.blocker} />
      </dl>
    </article>
  );
}

function ReviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function ListPanel({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
