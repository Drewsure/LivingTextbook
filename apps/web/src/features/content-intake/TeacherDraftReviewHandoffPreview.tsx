import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherDraftPackagePreview } from "@/data/sampleTeacherDraftPackage";
import { formatMode } from "@/lib/formatLabels";

interface TeacherDraftReviewHandoffPreviewProps {
  draft: TeacherDraftPackagePreview;
}

interface ReviewPacketSection {
  title: string;
  status: string;
  tone: "neutral" | "success" | "warning";
  items: string[];
}

export function TeacherDraftReviewHandoffPreview({ draft }: TeacherDraftReviewHandoffPreviewProps) {
  const reviewPacketSections: ReviewPacketSection[] = [
    {
      title: "Schema validation packet",
      status: "shape only",
      tone: "success",
      items: [
        `${draft.vocabularyDraft.length} vocabulary terms in the canonical 8-12 range.`,
        `${draft.targetSentenceDrafts.length} target sentence structures; exactly 2 are required.`,
        "Schema shape can be previewed locally, but saved review requires durable draft storage.",
      ],
    },
    {
      title: "Source lineage packet",
      status: "lineage visible",
      tone: "neutral",
      items: draft.sourceLineage,
    },
    {
      title: "Audio coverage packet",
      status: "review required",
      tone: "warning",
      items: [
        "Term audio must cover every edited vocabulary item.",
        "Sentence audio must cover both target sentence structures.",
        "Instruction audio must cover every selected activity mode.",
        "Fallback voice review is required before student use when generated or recorded audio is missing.",
      ],
    },
    {
      title: "Rights and version packet",
      status: "blocked",
      tone: "warning",
      items: [
        `Tenant scope: ${draft.tenantId}.`,
        `Source package: ${draft.sourcePackageId}.`,
        "A copied-from package version, media-rights snapshot, and teacher owner record are required before live review submission.",
      ],
    },
    {
      title: "Route and activity packet",
      status: "draft path",
      tone: "neutral",
      items: [
        `Requested path: ${draft.requestedActivityPath.map(formatMode).join(" -> ")}.`,
        "Curated activity pathways remain the default; this is not an unrestricted switch-template panel.",
      ],
    },
    {
      title: "Approval packet",
      status: "not submitted",
      tone: "warning",
      items: draft.reviewGates.map((gate) => `${gate.label}: ${gate.nextStep}`),
    },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Draft review handoff preview</p>
          <h3 className="mt-1 text-lg font-bold">Verifier packet before student use</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is a read-only summary of what a future submit-for-review workflow must carry. It does not submit,
            publish, assign, regenerate audio, or create a reviewed package.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review packet blocked" tone="warning" />
          <StatusPill label="No student assignment" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReviewBlocker label="Draft persistence required" />
        <ReviewBlocker label="Teacher ownership required" />
        <ReviewBlocker label="Verifier workflow required" />
        <ReviewBlocker label="Package approval required" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {reviewPacketSections.map((section) => (
          <section key={section.title} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">{section.title}</h4>
              <StatusPill label={section.status} tone={section.tone} />
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-white p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Hard boundary</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          No direct AI publish. No student assignment. Not submitted. Draft persistence required before any live
          review packet can leave this page.
        </p>
      </section>
    </Card>
  );
}

function ReviewBlocker({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Review blocker</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{label}</p>
    </div>
  );
}
