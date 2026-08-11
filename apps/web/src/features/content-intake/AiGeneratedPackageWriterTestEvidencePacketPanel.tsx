import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageWriterTestEvidencePacketCollectionWarnings,
  validateAiGeneratedPackageWriterTestEvidencePackets,
} from "@living-textbook/content-model/src/aiPackageWriterTestEvidencePacket";
import type {
  AiGeneratedPackageWriterTestEvidenceLane,
  AiGeneratedPackageWriterTestEvidencePacket,
  AiGeneratedPackageWriterTestEvidencePacketStatus,
} from "@/data/sampleAiGeneratedPackageWriterTestEvidencePacket";

interface AiGeneratedPackageWriterTestEvidencePacketPanelProps {
  packets: AiGeneratedPackageWriterTestEvidencePacket[];
}

const statusTone: Record<AiGeneratedPackageWriterTestEvidencePacketStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

export function AiGeneratedPackageWriterTestEvidencePacketPanel({
  packets,
}: AiGeneratedPackageWriterTestEvidencePacketPanelProps) {
  const laneCount = packets.reduce((total, packet) => total + packet.evidenceLanes.length, 0);
  const guardBlocks = validateAiGeneratedPackageWriterTestEvidencePackets(packets);
  const guardWarnings = getAiGeneratedPackageWriterTestEvidencePacketCollectionWarnings(packets);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer test evidence packet
          </p>
          <h2 className="mt-1 text-lg font-bold">Package writer test evidence packet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This gate names the fixture, route, audio, local, assignment, rollback, and support-language proof needed
            before writer tests or test harness decisions can exist.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Test evidence guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="Evidence only" tone="neutral" />
          <StatusPill label="Writer tests blocked" tone="warning" />
          <StatusPill label={`${laneCount} evidence lane(s)`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <EvidenceList
          title="Test evidence guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared test evidence guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <EvidenceList
          title="Test evidence guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared test evidence guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet) => (
          <article key={packet.evidencePacketId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.requestId}</p>
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
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Required test evidence lanes</h4>
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
              <EvidenceList title="Blocked evidence actions" items={packet.blockedEvidenceActions} tone="warning" />
              <EvidenceList title="Support-language boundary" items={packet.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function EvidenceLaneCard({ lane }: { lane: AiGeneratedPackageWriterTestEvidenceLane }) {
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
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
