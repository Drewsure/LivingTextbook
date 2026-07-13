import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherDraftPackagePreview } from "@/data/sampleTeacherDraftPackage";
import { formatMode } from "@/lib/formatLabels";

interface TeacherDraftAudioCoveragePreviewProps {
  draft: TeacherDraftPackagePreview;
}

export function TeacherDraftAudioCoveragePreview({ draft }: TeacherDraftAudioCoveragePreviewProps) {
  const instructionTargets = draft.requestedActivityPath.map((mode) => `${formatMode(mode)} instruction audio`);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Draft audio coverage preview</p>
          <h3 className="mt-1 text-lg font-bold">Audio before students</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Any edited teacher draft must confirm learner audio for terms, target sentences, game instructions, and feedback before review can pass.
          </p>
        </div>
        <StatusPill label="Audio review required" tone="warning" />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <AudioMetric label="Term audio" value={String(draft.vocabularyDraft.length)} />
        <AudioMetric label="Sentence audio" value={String(draft.targetSentenceDrafts.length)} />
        <AudioMetric label="Instruction audio" value={String(instructionTargets.length)} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <AudioTargetList title="Term audio required" items={draft.vocabularyDraft} />
        <AudioTargetList title="Sentence audio required" items={draft.targetSentenceDrafts} />
        <AudioTargetList title="Instruction audio required" items={instructionTargets} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Student-use gate</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          Audio regeneration required for edited text. Review cannot pass until every learner-facing text item has reviewed target-language audio or an approved fallback voice.
        </p>
      </section>
    </Card>
  );
}

function AudioMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function AudioTargetList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={`${items.length} items`} tone="neutral" />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
