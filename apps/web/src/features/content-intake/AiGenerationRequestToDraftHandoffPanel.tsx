import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGenerationRequestToDraftHandoffCollectionWarnings,
  isAiGenerationRequestToDraftHandoffLiveBlocked,
  validateAiGenerationRequestToDraftHandoffs,
} from "@living-textbook/content-model/src/aiGenerationRequestToDraftHandoff";
import type {
  AiGenerationRequestToDraftHandoff,
  AiGenerationRequestToDraftHandoffLane,
  AiGenerationRequestToDraftHandoffLaneStatus,
  AiGenerationRequestToDraftHandoffStatus,
} from "@/data/sampleAiGenerationRequestToDraftHandoff";

interface AiGenerationRequestToDraftHandoffPanelProps {
  handoffs: AiGenerationRequestToDraftHandoff[];
}

const statusTone: Record<AiGenerationRequestToDraftHandoffStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

const laneTone: Record<AiGenerationRequestToDraftHandoffLaneStatus, "neutral" | "success" | "warning"> = {
  "ready-for-review": "success",
  required: "warning",
  blocked: "warning",
};

export function AiGenerationRequestToDraftHandoffPanel({
  handoffs,
}: AiGenerationRequestToDraftHandoffPanelProps) {
  const guardBlocks = validateAiGenerationRequestToDraftHandoffs(handoffs);
  const guardWarnings = getAiGenerationRequestToDraftHandoffCollectionWarnings(handoffs);
  const blockingLaneCount = handoffs.reduce(
    (total, handoff) => total + handoff.lanes.filter((lane) => lane.blocksDraftCreation).length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI request-to-draft handoff</p>
          <h2 className="mt-1 text-lg font-bold">Review handoff before draft generation</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This panel shows which reviewed request-packet evidence may feed a future draft JSON preview. It is a
            preflight only: no model calls, billing, draft writes, verifier submissions, package assembly, routes,
            playlists, assignments, or support-language progress can start here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Handoff guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label={`${blockingLaneCount} draft block(s)`} tone={blockingLaneCount > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <HandoffList
          title="Handoff guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared handoff guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <HandoffList
          title="Handoff guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared handoff guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {handoffs.map((handoff) => (
          <article key={handoff.handoffId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="break-words text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {handoff.sourceRequestPacketId} {"->"} {handoff.targetDraftPreviewId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{handoff.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{handoff.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={handoff.status} tone={statusTone[handoff.status]} />
                <StatusPill
                  label={
                    isAiGenerationRequestToDraftHandoffLiveBlocked(handoff)
                      ? "Live handoff blocked"
                      : "Live handoff clear"
                  }
                  tone={isAiGenerationRequestToDraftHandoffLiveBlocked(handoff) ? "warning" : "success"}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <HandoffList
                title="Locked handoff fields"
                items={[
                  `handoff_mode: ${handoff.handoffMode}`,
                  `target_language_progress_trigger: ${handoff.targetLanguageProgressTrigger}`,
                  `support_language_progress_allowed: ${String(handoff.supportLanguageProgressAllowed)}`,
                  `live_model_dispatch_allowed: ${String(handoff.liveModelDispatchAllowed)}`,
                  `model_billing_allowed: ${String(handoff.modelBillingAllowed)}`,
                  `draft_creation_allowed: ${String(handoff.draftCreationAllowed)}`,
                  `draft_json_write_allowed: ${String(handoff.draftJsonWriteAllowed)}`,
                ]}
              />
              <HandoffList title="Required before draft" items={handoff.requiredBeforeDraft} tone="warning" />
              <HandoffList title="Blocked handoff actions" items={handoff.blockedActions} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Evidence lanes</h4>
                <StatusPill label={String(handoff.lanes.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {handoff.lanes.map((lane) => (
                  <HandoffLaneCard key={lane.laneId} lane={lane} />
                ))}
              </div>
            </section>

            <HandoffList title="Reviewer notes" items={handoff.reviewerNotes} />
          </article>
        ))}
      </div>
    </Card>
  );
}

function HandoffLaneCard({ lane }: { lane: AiGenerationRequestToDraftHandoffLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h5 className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h5>
          <p className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">{lane.sourceRecordType}</p>
        </div>
        <StatusPill label={lane.status} tone={laneTone[lane.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Record id</dt>
          <dd className="break-words">{lane.sourceRecordId}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Reviewer note</dt>
          <dd>{lane.reviewerNote}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Draft block</dt>
          <dd>{lane.blocksDraftCreation ? "Blocks draft creation" : "Review-only, no draft creation authority"}</dd>
        </div>
      </dl>
    </article>
  );
}

function HandoffList({
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
