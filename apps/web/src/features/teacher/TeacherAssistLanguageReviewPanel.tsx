import { Card, StatusPill } from "@living-textbook/ui";
import type { AssistLanguageReviewPacket, AssistLanguageReviewPacketStatus } from "@/data/sampleAssistLanguageReview";

interface TeacherAssistLanguageReviewPanelProps {
  packets: AssistLanguageReviewPacket[];
}

const statusTone: Record<AssistLanguageReviewPacketStatus, "neutral" | "success" | "warning"> = {
  "reviewed-text": "success",
  "review-required": "neutral",
  "not-configured": "neutral",
  blocked: "warning",
};

export function TeacherAssistLanguageReviewPanel({ packets }: TeacherAssistLanguageReviewPanelProps) {
  const configuredCount = packets.filter((packet) => packet.assistLanguage).length;
  const openItemCount = packets.reduce((total, packet) => total + packet.openItems.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher/admin review packet</p>
          <h2 className="mt-1 text-lg font-bold">Assist language evidence before student visibility</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet makes support-language coverage inspectable while preserving the rule that support language cannot trigger progression, mastery, or release.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${configuredCount} configured`} tone="neutral" />
          <StatusPill label={`${openItemCount} open item(s)`} tone={openItemCount > 0 ? "warning" : "success"} />
          <StatusPill label="Review only" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.tenantId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">
                  {packet.packageId}{packet.unitKey ? ` / ${packet.unitKey}` : ""}
                </p>
              </div>
              <StatusPill label={packet.status} tone={statusTone[packet.status]} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <ReviewFact label="Target language" value={packet.targetLanguage} />
              <ReviewFact label="Assist language" value={packet.assistLanguage ?? "Not configured"} />
              <ReviewFact label="Script / band" value={packet.scriptPolicy ? `${packet.scriptPolicy} / ${packet.levelBand ?? "tenant-defined"}` : "Not applicable"} />
              <ReviewFact label="Text review" value={packet.reviewStatus ?? "Not applicable"} />
              <ReviewFact label="Student visibility" value={packet.studentVisibility ?? "No student support"} />
              <ReviewFact label="Text coverage" value={`${packet.vocabularyGlossCount} terms / ${packet.sentenceGlossCount} sentences / ${packet.instructionGlossCount} instructions`} />
              <ReviewFact label="Assist audio cues" value={`${packet.assistAudioCueCount} cue(s)`} />
              <ReviewFact label="Audio coverage" value={`Terms ${packet.assistAudioCoverage.terms}; sentences ${packet.assistAudioCoverage.sentences}; instructions ${packet.assistAudioCoverage.instructions}`} />
              <ReviewFact label="Live AI fallback" value={packet.allowLiveAiFallback ? "Declared, review required" : "Disabled"} />
            </dl>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <ReviewList title="Evidence" items={packet.reviewEvidence} />
              <ReviewList title="Open items" items={packet.openItems.length > 0 ? packet.openItems : ["No open review items."]} tone={packet.openItems.length > 0 ? "warning" : "neutral"} />
              <ReviewList title="Blocked actions" items={packet.blockedActions} tone="warning" />
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
        No approval control is presented here. A future tenant-authorized workflow may record a decision only after policy, audio, rights, and package-release gates are implemented.
      </p>
    </Card>
  );
}

function ReviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function ReviewList({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
      </ul>
    </section>
  );
}
