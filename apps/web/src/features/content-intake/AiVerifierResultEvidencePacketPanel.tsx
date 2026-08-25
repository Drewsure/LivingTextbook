import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiVerifierResultEvidencePacketCollectionWarnings,
  validateAiVerifierResultEvidencePackets,
} from "@living-textbook/content-model/src/aiVerifierResultEvidencePacket";
import type {
  AiVerifierResultEvidenceCheckStatus,
  AiVerifierResultEvidencePacket,
  AiVerifierResultEvidencePacketStatus,
} from "@/data/sampleAiVerifierResultEvidencePacket";

interface AiVerifierResultEvidencePacketPanelProps {
  packets: AiVerifierResultEvidencePacket[];
}

const packetStatusTone: Record<AiVerifierResultEvidencePacketStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

const checkStatusTone: Record<AiVerifierResultEvidenceCheckStatus, "neutral" | "success" | "warning"> = {
  "passed-preview": "success",
  "failed-preview": "warning",
  "needs-evidence": "warning",
  blocked: "warning",
};

export function AiVerifierResultEvidencePacketPanel({ packets }: AiVerifierResultEvidencePacketPanelProps) {
  const guardBlocks = validateAiVerifierResultEvidencePackets(packets);
  const guardWarnings = getAiVerifierResultEvidencePacketCollectionWarnings(packets);
  const teacherApprovalBlockCount = packets.reduce(
    (total, packet) => total + packet.checks.filter((check) => check.blocksTeacherApproval).length,
    0,
  );

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI verifier result evidence packet</p>
          <h2 className="mt-1 text-lg font-bold">Verifier result before teacher approval</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview shows the result evidence a verifier must produce after storage readiness and before teacher
            approval. It does not call a live verifier, finalize pass/fail status, approve a package, create routes,
            create playlists, or assign students.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label="Verifier result guard active" tone="warning" />
          <StatusPill label={`${guardBlocks.length} guard block(s)`} tone={guardBlocks.length > 0 ? "warning" : "neutral"} />
          <StatusPill label={`${teacherApprovalBlockCount} teacher approval blocker(s)`} tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ResultList
          title="Verifier result guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No verifier result guard blocks detected."]}
          ownerId="ai-verifier-result-guard-blocks"
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ResultList
          title="Verifier result guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No verifier result guard warnings detected."]}
          ownerId="ai-verifier-result-guard-warnings"
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {packet.requestId} / {packet.resultState}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <StatusPill label={packet.status} tone={packetStatusTone[packet.status]} />
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <ResultMetric label="Verifier mode" value={packet.verifierMode} />
              <ResultMetric label="Teacher review allowed" value={String(packet.teacherReviewAllowed)} />
            </dl>

            <section className="mt-4 rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Verifier result checks</p>
                <StatusPill label={String(packet.checks.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {packet.checks.map((check) => (
                  <article key={`${packet.packetId}-${check.checkId}`} className="rounded-md border border-[var(--tenant-border)] bg-white/90 p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{check.label}</h4>
                        <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                          {check.sourceRecord}
                        </p>
                      </div>
                      <StatusPill label={check.status} tone={checkStatusTone[check.status]} />
                    </div>
                    <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                      <ResultFact label="Evidence" value={check.evidence} />
                      <ResultFact label="Required repair" value={check.requiredRepair} />
                      <ResultFact label="Blocks teacher approval" value={String(check.blocksTeacherApproval)} />
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ResultList
                title="Required before teacher review"
                items={packet.requiredBeforeTeacherReview}
                ownerId={packet.packetId}
              />
              <ResultList title="Blocked actions" items={packet.blockedActions} ownerId={packet.packetId} tone="warning" />
              <ResultList title="Next required records" items={packet.nextRequiredRecords} ownerId={packet.packetId} />
              <ResultList title="Reviewer notes" items={packet.reviewerNotes} ownerId={packet.packetId} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function ResultFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function ResultList({
  title,
  items,
  ownerId,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  ownerId: string;
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
          <li key={`${ownerId}-${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
