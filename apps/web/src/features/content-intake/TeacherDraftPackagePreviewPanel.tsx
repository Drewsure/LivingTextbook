import { Card, StatusPill } from "@living-textbook/ui";
import type {
  TeacherDraftGateStatus,
  TeacherDraftPackagePreview,
  TeacherDraftPackageStatus,
} from "@/data/sampleTeacherDraftPackage";
import { TeacherDraftAudioCoveragePreview } from "./TeacherDraftAudioCoveragePreview";
import { TeacherDraftLocalEditPreview } from "./TeacherDraftLocalEditPreview";
import { TeacherDraftReviewHandoffPreview } from "./TeacherDraftReviewHandoffPreview";
import { formatMode } from "@/lib/formatLabels";

interface TeacherDraftPackagePreviewPanelProps {
  draft: TeacherDraftPackagePreview;
}

const draftStatusTone: Record<TeacherDraftPackageStatus, "neutral" | "success" | "warning"> = {
  "teacher-only-draft": "warning",
  "submitted-for-review": "neutral",
  "student-ready": "success",
};

const gateStatusTone: Record<TeacherDraftGateStatus, "neutral" | "success" | "warning"> = {
  pass: "success",
  blocked: "warning",
  "review-required": "neutral",
};

export function TeacherDraftPackagePreviewPanel({ draft }: TeacherDraftPackagePreviewPanelProps) {
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher draft package</p>
            <h2 className="mt-1 text-2xl font-bold">{draft.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This is a teacher-only authoring preview. Fast authoring creates draft packages only; student assignment stays blocked until review, audio, rights, route, and approval gates pass.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label="Draft only" tone="warning" />
            <StatusPill label={draft.status} tone={draftStatusTone[draft.status]} />
          </div>
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DraftMetric label="Tenant" value={draft.tenantId} />
          <DraftMetric label="Source package" value={draft.sourcePackageId} />
          <DraftMetric label="Unit" value={draft.unitKey} />
          <DraftMetric label="Student assignment" value={draft.canAssignToStudents ? "Allowed" : "Blocked"} />
        </dl>
      </Card>

      <TeacherDraftLocalEditPreview draft={draft} />
      <TeacherDraftAudioCoveragePreview draft={draft} />
      <TeacherDraftReviewHandoffPreview draft={draft} />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Draft payload preview</p>
            <h3 className="mt-1 text-lg font-bold">Review before assignment</h3>
          </div>
          <StatusPill label="Student assignment blocked" tone="warning" />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">Vocabulary draft</h4>
              <StatusPill label={`${draft.vocabularyDraft.length} terms`} tone="success" />
            </div>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--tenant-text)]">
              {draft.vocabularyDraft.map((term) => (
                <li key={term} className="rounded-full border border-[var(--tenant-border)] bg-white/80 px-3 py-1 font-semibold">
                  {term}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <h4 className="text-sm font-bold text-[var(--tenant-text)]">Target sentence drafts</h4>
            <ol className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {draft.targetSentenceDrafts.map((sentence) => (
                <li key={sentence} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                  {sentence}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Activity and audio path</p>
            <h3 className="mt-1 text-lg font-bold">Audio before students</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{draft.audioPlanSummary}</p>
          </div>
          <StatusPill label="Audio review required" tone="warning" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {draft.requestedActivityPath.map((mode) => (
            <span
              key={mode}
              className="rounded-full border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--tenant-text)]"
            >
              {formatMode(mode)}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Authoring boundaries</p>
            <h3 className="mt-1 text-lg font-bold">Private tenant library candidate</h3>
          </div>
          <StatusPill label="No direct publish" tone="success" />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <DraftList title="Source lineage" items={draft.sourceLineage} tone="neutral" />
          <DraftList title="Allowed actions" items={draft.allowedActions} tone="success" />
          <DraftList title="Blocked actions" items={draft.blockedActions} tone="warning" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Draft review gates</p>
            <h3 className="mt-1 text-lg font-bold">What must pass before students see it</h3>
          </div>
          <StatusPill label={`${draft.reviewGates.length} gates`} tone="neutral" />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {draft.reviewGates.map((gate) => (
            <section key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h4>
                <StatusPill label={gate.status} tone={gateStatusTone[gate.status]} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
                <span className="font-semibold text-[var(--tenant-text)]">Evidence:</span> {gate.evidence}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                <span className="font-semibold text-[var(--tenant-text)]">Next:</span> {gate.nextStep}
              </p>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DraftMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function DraftList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
