import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiVerifierSubmissionStorageGuardCollectionWarnings,
  validateAiVerifierSubmissionStorageGuards,
} from "@living-textbook/content-model/src/aiVerifierSubmissionStorageGuard";
import type {
  AiVerifierSubmissionStorageGuard,
  AiVerifierSubmissionStorageGuardStatus,
} from "@/data/sampleAiVerifierSubmissionStorageGuard";

interface AiVerifierSubmissionStorageGuardPanelProps {
  guards: AiVerifierSubmissionStorageGuard[];
}

const statusLabel: Record<AiVerifierSubmissionStorageGuardStatus, string> = {
  "review-only": "Review only",
  "storage-required": "Storage required",
  blocked: "Blocked",
};

export function AiVerifierSubmissionStorageGuardPanel({ guards }: AiVerifierSubmissionStorageGuardPanelProps) {
  const guardBlocks = validateAiVerifierSubmissionStorageGuards(guards);
  const guardWarnings = getAiVerifierSubmissionStorageGuardCollectionWarnings(guards);
  const blockedActionCount = guards.reduce((total, guard) => total + guard.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI verifier submission storage guard</p>
          <h2 className="mt-1 text-lg font-bold">Durable verifier records before live verification</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Verifier packets remain review-only until tenant-scoped verifier storage, reviewer identity, evidence
            attachments, audio approval, approval ledger, release-control binding, retention policy, and audit trail are
            ready for hosted and local companion adapters.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label="Verifier storage guard active" tone="warning" />
          <StatusPill label={`${guardBlocks.length} guard block(s)`} tone="warning" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <GuardList
          title="Verifier storage guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No verifier storage guard blocks detected."]}
          ownerId="ai-verifier-storage-guard-blocks"
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <GuardList
          title="Verifier storage guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No verifier storage guard warnings detected."]}
          ownerId="ai-verifier-storage-guard-warnings"
        />
      </div>

      <div className="mt-5 grid gap-4">
        {guards.map((guard) => (
          <article
            key={guard.guardId}
            className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {guard.tenantId} / {guard.verifierPacketId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{guard.label}</h3>
              </div>
              <StatusPill label={statusLabel[guard.status]} tone="warning" />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{guard.summary}</p>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <GuardMetric label="Storage record type" value={guard.storageRecordType} />
              <GuardMetric label="Verifier submission allowed" value={String(guard.verifierSubmissionAllowed)} />
            </dl>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <GuardList title="Required records" items={guard.requiredRecordIds} ownerId={guard.guardId} />
              <GuardList title="Visible fields" items={guard.visibleFields} ownerId={guard.guardId} />
              <GuardList
                title="Required before verifier submission"
                items={guard.requiredBeforeVerifierSubmission}
                ownerId={guard.guardId}
              />
              <GuardList title="Blocked storage actions" items={guard.blockedActions} ownerId={guard.guardId} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Hosted and local adapter requirements</h4>
                <StatusPill label={String(guard.adapterRequirements.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {guard.adapterRequirements.map((requirement) => (
                  <article key={`${guard.guardId}-${requirement.adapterType}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h5 className="text-sm font-bold text-[var(--tenant-text)]">{requirement.label}</h5>
                      <StatusPill label={requirement.adapterType} tone="neutral" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{requirement.note}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <GuardList
                        title="Adapter records"
                        items={requirement.requiredRecords}
                        ownerId={`${guard.guardId}-${requirement.adapterType}`}
                      />
                      <GuardList
                        title="Adapter blocked writes"
                        items={requirement.blockedWrites}
                        ownerId={`${guard.guardId}-${requirement.adapterType}`}
                        tone="warning"
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <GuardList title="Reviewer notes" items={guard.reviewerNotes} ownerId={`${guard.guardId}-reviewer-notes`} />
          </article>
        ))}
      </div>
    </Card>
  );
}

function GuardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function GuardList({
  title,
  items,
  ownerId,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  ownerId: string;
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
          <li key={`${ownerId}-${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
