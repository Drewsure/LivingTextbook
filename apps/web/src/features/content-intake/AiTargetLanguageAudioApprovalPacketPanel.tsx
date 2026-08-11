import { Card, StatusPill } from "@living-textbook/ui";

import type {
  AiTargetLanguageAudioApprovalCueKind,
  AiTargetLanguageAudioApprovalCueStatus,
  AiTargetLanguageAudioApprovalPacket,
  AiTargetLanguageAudioApprovalPacketStatus,
} from "@/data/sampleAiTargetLanguageAudioApprovalPacket";

interface AiTargetLanguageAudioApprovalPacketPanelProps {
  packets: AiTargetLanguageAudioApprovalPacket[];
}

const packetStatusTone: Record<AiTargetLanguageAudioApprovalPacketStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-audio-review": "neutral",
};

const cueStatusTone: Record<AiTargetLanguageAudioApprovalCueStatus, "neutral" | "warning"> = {
  "approved-preview": "neutral",
  blocked: "warning",
  "missing-audio": "warning",
  "needs-review": "warning",
  "support-only": "neutral",
};

const cueKindOrder: AiTargetLanguageAudioApprovalCueKind[] = [
  "term",
  "sentence",
  "instruction",
  "feedback",
  "control",
  "support-language",
  "background-media",
];

export function AiTargetLanguageAudioApprovalPacketPanel({
  packets,
}: AiTargetLanguageAudioApprovalPacketPanelProps) {
  const reviewCueCount = packets.reduce(
    (total, packet) => total + packet.cues.filter((cue) => cue.status === "needs-review").length,
    0,
  );

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Target-language audio approval packet</p>
          <h2 className="mt-1 text-lg font-bold">Audio before package approval</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Generated packages need an explicit teacher-readable audio approval packet before package assembly,
            playlists, assignments, or student-ready markers can be considered. Support-language audio stays support-only.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="No audio approval capture" tone="warning" />
          <StatusPill label={`${reviewCueCount} cue(s) need review`} tone="warning" />
        </div>
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

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <AudioPolicyCard title="Target language" value={packet.targetLanguage} />
              <AudioPolicyCard title="Assist language boundary" value={packet.assistLanguageBoundary} />
              <AudioPolicyCard title="Approval owner" value={packet.approvalOwner} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ListPanel title="Required coverage" items={packet.requiredCoverage} />
              <ListPanel title="Approval checks" items={packet.approvalChecks} />
              <ListPanel title="Blocked audio actions" items={packet.blockedActions} tone="warning" />
              <ListPanel title="Next required records" items={packet.nextRequiredRecords} />
            </div>

            <section className="mt-4 rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Audio cues for review</p>
                <StatusPill label={packet.targetLanguageApprovalRecord} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3">
                {cueKindOrder.map((kind) => {
                  const cues = packet.cues.filter((cue) => cue.kind === kind);

                  if (cues.length === 0) {
                    return null;
                  }

                  return (
                    <section key={`${packet.packetId}-${kind}`} className="rounded-md border border-[var(--tenant-border)] bg-white/90 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{kind}</h4>
                        <StatusPill label={`${cues.length} cue(s)`} tone="neutral" />
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {cues.map((cue) => (
                          <AudioCueCard key={cue.cueId} cue={cue} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>
          </article>
        ))}
      </div>
    </Card>
  );
}

function AudioPolicyCard({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function AudioCueCard({ cue }: { cue: AiTargetLanguageAudioApprovalPacket["cues"][number] }) {
  return (
    <article className="rounded-md border border-[var(--tenant-border)] bg-white p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{cue.language}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{cue.text}</h5>
          <p className="mt-1 text-xs text-[var(--tenant-muted)]">{cue.gameModes.join(", ")}</p>
        </div>
        <StatusPill label={cue.status} tone={cueStatusTone[cue.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <ReviewFact label="Source record" value={cue.sourceRecord} />
        <ReviewFact label="Approval question" value={cue.approvalQuestion} />
        <ReviewFact label="Progress boundary" value={cue.progressBoundary} />
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
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
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
