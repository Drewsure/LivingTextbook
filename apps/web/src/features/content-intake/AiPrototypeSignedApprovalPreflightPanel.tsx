import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypeSignedApprovalPreflightCollectionWarnings,
  validateAiPrototypeSignedApprovalPreflights,
} from "@living-textbook/content-model/src/aiPrototypeSignedApprovalPreflight";

import type {
  AiPrototypeSignedApprovalPreflight,
  AiPrototypeSignedApprovalPreflightStatus,
} from "@/data/sampleAiPrototypeSignedApprovalPreflight";

interface AiPrototypeSignedApprovalPreflightPanelProps {
  preflights: AiPrototypeSignedApprovalPreflight[];
}

const statusTone: Record<AiPrototypeSignedApprovalPreflightStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-signature-policy-review": "success",
};

const statusLabel: Record<AiPrototypeSignedApprovalPreflightStatus, string> = {
  blocked: "Signed approval blocked",
  "review-only": "Review only",
  "ready-for-signature-policy-review": "Ready for signature policy review",
};

export function AiPrototypeSignedApprovalPreflightPanel({
  preflights,
}: AiPrototypeSignedApprovalPreflightPanelProps) {
  const guardBlocks = validateAiPrototypeSignedApprovalPreflights(preflights);
  const guardWarnings = getAiPrototypeSignedApprovalPreflightCollectionWarnings(preflights);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI prototype signed approval preflight
          </p>
          <h2 className="mt-1 text-lg font-bold">Signed approval before patch authorization</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preflight names the future signed approval evidence without capturing a signature, approving a patch,
            or changing files, routes, tests, packages, scoring, rewards, audio manifests, or assignments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Signed approval preflight guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No signed approval capture" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListPanel
          title="Signed approval preflight guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared signed approval preflight guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ListPanel
          title="Signed approval preflight guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared signed approval preflight guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {preflights.map((preflight) => (
          <article key={preflight.preflightId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{preflight.decisionId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{preflight.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preflight.summary}</p>
              </div>
              <StatusPill label={statusLabel[preflight.status]} tone={statusTone[preflight.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ListPanel title="Required identity lanes" items={preflight.requiredIdentityLanes} />
              <ListPanel title="Scope locks" items={preflight.scopeLocks} />
              <ListPanel title="Approval record draft fields" items={preflight.approvalRecordDraftFields} />
              <ListPanel title="Evidence checklist" items={preflight.evidenceChecklist} />
              <ListPanel title="Cannot approve while" items={preflight.cannotApproveWhile} tone="warning" />
              <ListPanel title="Blocked actions" items={preflight.blockedActions} tone="warning" />
              <ListPanel title="Next required records" items={preflight.nextRequiredRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
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
