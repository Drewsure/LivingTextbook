import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AssistLanguageAudioCatalogDecision,
  AssistLanguageAudioCatalogEvidenceStatus,
  AssistLanguageAudioCatalogRecord,
} from "@living-textbook/content-model";

interface TeacherAssistLanguageAudioCatalogPanelProps {
  records: AssistLanguageAudioCatalogRecord[];
}

const decisionTone: Record<AssistLanguageAudioCatalogDecision, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "needs-review": "warning",
  "admission-ready": "success",
};

const evidenceTone: Record<AssistLanguageAudioCatalogEvidenceStatus, "neutral" | "success" | "warning"> = {
  missing: "warning",
  captured: "neutral",
  reviewed: "success",
};

export function TeacherAssistLanguageAudioCatalogPanel({ records }: TeacherAssistLanguageAudioCatalogPanelProps) {
  const blocked = records.filter((record) => record.decision === "blocked").length;
  const review = records.filter((record) => record.decision === "needs-review").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Support-audio catalog admission</p>
          <h2 className="mt-1 text-xl font-bold">Review before catalog binding</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            A support-language recording is not ready for a student package until its source lineage, checksum, transcript match, rights, accessibility, and hosted/local delivery evidence are reviewed together.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review only" tone="warning" />
          <StatusPill label={`${blocked} blocked`} tone={blocked > 0 ? "warning" : "success"} />
          <StatusPill label={`${review} needs review`} tone={review > 0 ? "warning" : "neutral"} />
        </div>
      </div>

      {records.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {records.map((record) => <CatalogRecordCard key={record.catalogRecordId} record={record} />)}
        </div>
      ) : (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
          No support-language audio catalog records are configured for this tenant.
        </p>
      )}

      <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
        This preview does not upload, write storage, approve rights, activate a local bundle, promote a catalog item, expose student audio, or bill speech services.
      </p>
    </Card>
  );
}

function CatalogRecordCard({ record }: { record: AssistLanguageAudioCatalogRecord }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.kind} · {record.language}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.glossText || "Missing reviewed gloss"}</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">Target text: {record.sourceText}</p>
        </div>
        <StatusPill label={record.decision} tone={decisionTone[record.decision]} />
      </div>

      <dl className="mt-4 grid gap-3 text-xs leading-5 sm:grid-cols-2 lg:grid-cols-4">
        <EvidenceFact label="Checksum" value={record.checksum ?? "Not captured"} />
        <EvidenceFact label="Rights" value={record.rightsStatus ?? "Not reviewed"} />
        <EvidenceFact label="Source lineage" value={record.sourceLineageRef} />
        <EvidenceFact label="Delivery" value={deliveryLabel(record)} />
      </dl>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <EvidenceStatus label="Transcript" status={record.accessibility.transcript} />
        <EvidenceStatus label="Spoken-text match" status={record.accessibility.spokenTextMatch} />
        <EvidenceStatus label="Fallback" status={record.accessibility.fallback} />
      </div>

      <ul className="mt-4 grid gap-2 text-xs leading-5 text-[var(--tenant-muted)]">
        {record.blockers.map((blocker, index) => <li key={`${record.catalogRecordId}-blocker-${index}`}>{blocker}</li>)}
      </ul>
    </article>
  );
}

function EvidenceFact({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-semibold text-[var(--tenant-text)]">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>;
}

function EvidenceStatus({ label, status }: { label: string; status: AssistLanguageAudioCatalogEvidenceStatus }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-2">
      <span className="font-semibold text-[var(--tenant-text)]">{label}</span>
      <StatusPill label={status} tone={evidenceTone[status]} />
    </div>
  );
}

function deliveryLabel(record: AssistLanguageAudioCatalogRecord): string {
  if (record.delivery.hostedReference && record.delivery.localBundlePath) return "Hosted + local";
  if (record.delivery.hostedReference) return "Hosted only";
  if (record.delivery.localBundlePath) return "Local only";
  return "Not captured";
}
