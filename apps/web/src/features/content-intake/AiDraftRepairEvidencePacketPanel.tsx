import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiDraftRepairEvidencePacketCollectionWarnings,
  isAiDraftRepairEvidencePacketLiveBlocked,
  validateAiDraftRepairEvidencePackets,
} from "@living-textbook/content-model/src/aiDraftRepairEvidencePacket";
import type {
  AiDraftRepairEvidenceItem,
  AiDraftRepairEvidenceItemStatus,
  AiDraftRepairEvidencePacket,
  AiDraftRepairEvidencePacketStatus,
} from "@/data/sampleAiDraftRepairEvidencePacket";

interface AiDraftRepairEvidencePacketPanelProps {
  packets: AiDraftRepairEvidencePacket[];
}

const packetTone: Record<AiDraftRepairEvidencePacketStatus, "neutral" | "warning"> = {
  "evidence-only": "neutral",
  blocked: "warning",
};

const itemTone: Record<AiDraftRepairEvidenceItemStatus, "neutral" | "success" | "warning"> = {
  attached: "success",
  "review-required": "warning",
  missing: "warning",
};

export function AiDraftRepairEvidencePacketPanel({ packets }: AiDraftRepairEvidencePacketPanelProps) {
  const guardBlocks = validateAiDraftRepairEvidencePackets(packets);
  const guardWarnings = getAiDraftRepairEvidencePacketCollectionWarnings(packets);
  const verifierBlockCount = packets.reduce(
    (total, packet) => total + packet.evidenceItems.filter((item) => item.blocksVerifierSubmission).length,
    0,
  );

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI draft repair evidence packet</p>
          <h2 className="mt-1 text-lg font-bold">Evidence before verifier submission</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Repair evidence turns correction-queue items into a review packet. It keeps teacher/admin review practical
            while blocking auto-fix, live AI regeneration, verifier submission, package assembly, routes, playlists,
            assignments, student-ready markers, and support-language progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Repair evidence guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill
            label={`${verifierBlockCount} verifier block(s)`}
            tone={verifierBlockCount > 0 ? "warning" : "success"}
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <RepairEvidenceList
          title="Repair evidence guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared repair evidence guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <RepairEvidenceList
          title="Repair evidence guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared repair evidence guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-4">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="break-words text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {packet.correctionQueueId} {"->"} {packet.draftPreviewId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={packet.status} tone={packetTone[packet.status]} />
                <StatusPill
                  label={
                    isAiDraftRepairEvidencePacketLiveBlocked(packet)
                      ? "Verifier submission blocked"
                      : "Verifier submission clear"
                  }
                  tone={isAiDraftRepairEvidencePacketLiveBlocked(packet) ? "warning" : "success"}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <RepairEvidenceList
                title="Locked repair fields"
                items={[
                  `target_language_progress_trigger: ${packet.targetLanguageProgressTrigger}`,
                  `support_language_progress_allowed: ${String(packet.supportLanguageProgressAllowed)}`,
                  `auto_fix_allowed: ${String(packet.autoFixAllowed)}`,
                  `live_ai_regeneration_allowed: ${String(packet.liveAiRegenerationAllowed)}`,
                  `verifier_submission_allowed: ${String(packet.verifierSubmissionAllowed)}`,
                  `student_assignment_allowed: ${String(packet.studentAssignmentAllowed)}`,
                ]}
              />
              <RepairEvidenceList title="Required before verifier" items={packet.requiredBeforeVerifier} tone="warning" />
              <RepairEvidenceList title="Blocked repair actions" items={packet.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Repair evidence items</h4>
                <StatusPill label={String(packet.evidenceItems.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {packet.evidenceItems.map((item) => (
                  <RepairEvidenceItemCard key={item.evidenceId} item={item} />
                ))}
              </div>
            </section>

            <RepairEvidenceList title="Reviewer notes" items={packet.reviewerNotes} />
          </article>
        ))}
      </div>
    </Card>
  );
}

function RepairEvidenceItemCard({ item }: { item: AiDraftRepairEvidenceItem }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.repairLane}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h5>
        </div>
        <StatusPill label={item.status} tone={itemTone[item.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
        <RepairEvidenceFact label="Queue item" value={item.sourceQueueItemId} />
        <RepairEvidenceFact label="Owner" value={item.owner} />
        <RepairEvidenceFact label="Required record" value={item.requiredRecord} />
        <RepairEvidenceFact
          label="Verifier effect"
          value={item.blocksVerifierSubmission ? "Blocks verifier submission" : "Evidence noted only"}
        />
      </dl>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{item.evidenceNote}</p>
    </article>
  );
}

function RepairEvidenceFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function RepairEvidenceList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
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
