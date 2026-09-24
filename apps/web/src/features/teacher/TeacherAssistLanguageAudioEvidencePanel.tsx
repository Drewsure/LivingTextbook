import { Card, StatusPill } from "@living-textbook/ui";
import type { AssistLanguageAudioEvidencePacket, AssistLanguageAudioEvidenceStatus } from "@/data/sampleAssistLanguageAudioEvidence";

interface TeacherAssistLanguageAudioEvidencePanelProps {
  packets: AssistLanguageAudioEvidencePacket[];
}

const statusTone: Record<AssistLanguageAudioEvidenceStatus, "neutral" | "success" | "warning"> = {
  "not-configured": "neutral",
  missing: "warning",
  "cue-only": "warning",
  "metadata-captured": "success",
  "rights-review": "warning",
};

export function TeacherAssistLanguageAudioEvidencePanel({ packets }: TeacherAssistLanguageAudioEvidencePanelProps) {
  const openItems = packets.reduce((total, packet) => total + packet.missingEvidence.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher/admin evidence packet</p>
          <h2 className="mt-1 text-lg font-bold">Assist-language audio asset evidence</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Every reviewed support gloss must be traceable to an assist-language cue and an audio asset before future student-facing media approval can be considered.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review only" tone="warning" />
          <StatusPill label={`${openItems} open item(s)`} tone={openItems > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.tenantId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.assistLanguage ? `${packet.assistLanguage} audio coverage` : "No assist-language audio plan"}</h3>
                <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">{packet.packageId}{packet.unitKey ? ` / ${packet.unitKey}` : ""}</p>
              </div>
              <StatusPill label={packet.reviewStatus} tone="warning" />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <EvidenceFact label="Target language" value={packet.targetLanguage ?? "Not declared"} />
              <EvidenceFact label="Assist language" value={packet.assistLanguage ?? "Not configured"} />
              <EvidenceFact label="Required items" value={String(packet.items.length)} />
              <EvidenceFact label="Items with open evidence" value={String(packet.items.filter((item) => item.blockers.length > 0).length)} />
            </dl>

            {packet.items.length > 0 && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {packet.items.map((item) => (
                  <article key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.kind}</p>
                        <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.glossText || item.sourceText}</h4>
                        <p className="mt-1 text-xs text-[var(--tenant-muted)]">Source text: {item.sourceText}</p>
                      </div>
                      <StatusPill label={item.status} tone={statusTone[item.status]} />
                    </div>
                    <dl className="mt-3 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">
                      <EvidenceFact label="Audio cue" value={item.audioCueId ?? "Not bound"} />
                      <EvidenceFact label="Media asset" value={item.mediaAssetId ?? "Not bound"} />
                    </dl>
                    {item.blockers.length > 0 && (
                      <ul className="mt-3 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">
                        {item.blockers.map((blocker, index) => <li key={`${item.itemId}-blocker-${index}`}>{blocker}</li>)}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            )}

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <EvidenceList title="Missing evidence" items={packet.missingEvidence} />
              <EvidenceList title="Blocked actions" items={packet.blockedActions} />
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
        This workspace does not upload, approve, promote, download, bill speech services, or expose assist audio to students.
      </p>
    </Card>
  );
}

function EvidenceFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function EvidenceList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone="warning" />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.length > 0 ? items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>) : <li>None recorded.</li>}
      </ul>
    </section>
  );
}
