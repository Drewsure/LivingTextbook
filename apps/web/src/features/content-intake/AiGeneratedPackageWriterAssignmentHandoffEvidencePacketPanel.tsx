import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageWriterAssignmentHandoffEvidencePacketCollectionWarnings,
  validateAiGeneratedPackageWriterAssignmentHandoffEvidencePackets,
} from "@living-textbook/content-model/src/aiPackageWriterAssignmentHandoffEvidencePacket";

import type {
  AiGeneratedPackageWriterAssignmentHandoffEvidenceLane,
  AiGeneratedPackageWriterAssignmentHandoffEvidencePacket,
  AiGeneratedPackageWriterAssignmentHandoffEvidencePacketStatus,
} from "@/data/sampleAiGeneratedPackageWriterAssignmentHandoffEvidencePacket";

interface AiGeneratedPackageWriterAssignmentHandoffEvidencePacketPanelProps {
  packets: AiGeneratedPackageWriterAssignmentHandoffEvidencePacket[];
}

const statusTone: Record<AiGeneratedPackageWriterAssignmentHandoffEvidencePacketStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "review-only": "neutral",
};

export function AiGeneratedPackageWriterAssignmentHandoffEvidencePacketPanel({
  packets,
}: AiGeneratedPackageWriterAssignmentHandoffEvidencePacketPanelProps) {
  const guardBlocks = validateAiGeneratedPackageWriterAssignmentHandoffEvidencePackets(packets);
  const guardWarnings = getAiGeneratedPackageWriterAssignmentHandoffEvidencePacketCollectionWarnings(packets);
  const laneCount = packets.reduce((total, packet) => total + packet.evidenceLanes.length, 0);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer assignment handoff evidence packet
          </p>
          <h2 className="mt-1 text-lg font-bold">Assignment handoff proof stays review-only</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet gathers the proof needed before a generated package can become a teacher QR/front-door
            assignment. It keeps private links, roster scope, progress events, report exports, classroom launch, and
            support-language boundaries blocked.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Handoff evidence active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${laneCount} evidence lane(s)`} tone="neutral" />
          <StatusPill label="No assignment activation" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <EvidenceList
          title="Assignment handoff evidence blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared assignment handoff evidence blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <EvidenceList
          title="Assignment handoff evidence warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared assignment handoff evidence warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {packets.map((packet) => (
          <article key={packet.evidencePacketId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.assignmentPreviewId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={packet.status} tone={statusTone[packet.status]} />
                <StatusPill label={packet.evidenceState} tone="warning" />
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Required handoff evidence lanes</h4>
                <StatusPill label={packet.packageIdPreview} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {packet.evidenceLanes.map((lane) => (
                  <EvidenceLaneCard key={lane.laneId} lane={lane} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <EvidenceList title="Missing evidence" items={packet.missingEvidence} tone="warning" />
              <EvidenceList title="Next required records" items={packet.nextRequiredRecords} />
              <EvidenceList title="Blocked handoff actions" items={packet.blockedHandoffActions} tone="warning" />
              <EvidenceList title="Support-language boundary" items={packet.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function EvidenceLaneCard({ lane }: { lane: AiGeneratedPackageWriterAssignmentHandoffEvidenceLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Evidence lane</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h5>
          <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{lane.laneId}</p>
        </div>
        <StatusPill label={`${lane.sourceRecords.length} source(s)`} tone="neutral" />
      </div>
      <div className="mt-3 grid gap-3">
        <EvidenceList title="Source records" items={lane.sourceRecords} />
        <EvidenceList title="Required evidence" items={lane.requiredEvidence} />
        <EvidenceList title="Acceptance checks" items={lane.acceptanceChecks} />
        <EvidenceList title="Blocked gaps" items={lane.blockedGaps} tone="warning" />
      </div>
    </article>
  );
}

function EvidenceList({
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
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
