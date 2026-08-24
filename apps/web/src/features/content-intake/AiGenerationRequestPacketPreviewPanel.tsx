import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGenerationRequestPacketPreviewWarnings,
  isAiGenerationRequestPacketLiveBlocked,
  validateAiGenerationRequestPacketPreview,
} from "@living-textbook/content-model/src/aiGenerationRequestPacketPreview";
import type {
  AiGenerationRequestPacketPreview,
  AiGenerationRequestPacketStatus,
} from "@/data/sampleAiGenerationRequestPacketPreview";

interface AiGenerationRequestPacketPreviewPanelProps {
  packets: AiGenerationRequestPacketPreview[];
}

const statusTone: Record<AiGenerationRequestPacketStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  "storage-required": "warning",
  blocked: "warning",
};

export function AiGenerationRequestPacketPreviewPanel({ packets }: AiGenerationRequestPacketPreviewPanelProps) {
  const packetStates = packets.map((packet) => ({
    packet,
    errors: validateAiGenerationRequestPacketPreview(packet),
    warnings: getAiGenerationRequestPacketPreviewWarnings(packet),
    liveBlocked: isAiGenerationRequestPacketLiveBlocked(packet),
  }));
  const blockedActionCount = packets.reduce((total, packet) => total + packet.blockedActions.length, 0);
  const validationBlockCount = packetStates.reduce((total, item) => total + item.errors.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generation request packet preview</p>
          <h2 className="mt-1 text-lg font-bold">Review packet before model calls</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview shows the exact request packet evidence a teacher/admin must review before live model calls,
            cost billing, draft creation, verifier submission, package assembly, routes, playlists, or assignments can exist.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Request packet guard active" tone="neutral" />
          <StatusPill label={`${validationBlockCount} validation block(s)`} tone={validationBlockCount > 0 ? "warning" : "neutral"} />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {packetStates.map(({ packet, errors, warnings, liveBlocked }) => (
          <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {packet.tenantId} / {packet.requestId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={packet.status} tone={statusTone[packet.status]} />
                <StatusPill label={liveBlocked ? "Live AI blocked" : "Live AI clear"} tone={liveBlocked ? "warning" : "success"} />
              </div>
            </div>

            <dl className="mt-4 grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 md:grid-cols-2 xl:grid-cols-4">
              <PacketFact label="target_language_progress_trigger" value={packet.targetLanguageProgressTrigger} />
              <PacketFact label="support_language_progress_allowed" value={String(packet.supportLanguageProgressAllowed)} />
              <PacketFact label="live_model_dispatch_allowed" value={String(packet.liveModelDispatchAllowed)} />
              <PacketFact label="model_billing_allowed" value={String(packet.modelBillingAllowed)} />
            </dl>

            <div className="mt-4 grid gap-3 xl:grid-cols-4">
              <PacketList
                title="Locked packet fields"
                items={[
                  `target_language_progress_trigger: ${packet.targetLanguageProgressTrigger}`,
                  `support_language_progress_allowed: ${String(packet.supportLanguageProgressAllowed)}`,
                  `live_model_dispatch_allowed: ${String(packet.liveModelDispatchAllowed)}`,
                  `model_billing_allowed: ${String(packet.modelBillingAllowed)}`,
                ]}
              />
              <PacketList
                title="Evidence links"
                items={packet.evidenceLinks.map((link) => `${link.recordType}: ${link.status} - ${link.note}`)}
              />
              <PacketList title="Required before live request" items={packet.requiredBeforeLiveRequest} />
              <PacketList title="Blocked packet actions" items={packet.blockedActions} tone="warning" />
              <PacketList title="Reviewer notes" items={packet.reviewerNotes} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <PacketList
                title="Request packet guard blocks"
                items={errors}
                tone={errors.length > 0 ? "warning" : "neutral"}
                emptyLabel="Request packet preview has no structural blockers."
              />
              <PacketList
                title="Request packet guard warnings"
                items={warnings}
                tone={warnings.length > 0 ? "warning" : "neutral"}
                emptyLabel="Request packet preview has no warnings."
              />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function PacketFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">
        {label}: {value}
      </dd>
    </div>
  );
}

function PacketList({
  title,
  items,
  tone = "neutral",
  emptyLabel = "No items.",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
  emptyLabel?: string;
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.length === 0 ? (
          <li>{emptyLabel}</li>
        ) : (
          items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)
        )}
      </ul>
    </section>
  );
}
