import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherDraftPackagePreview } from "@/data/sampleTeacherDraftPackage";

interface TeacherDraftContentEntryWorkbenchPreviewProps {
  draft: TeacherDraftPackagePreview;
}

const formattingTools = ["Bold", "Superscript", "Subscript", "Symbol picker"];
const fontRenderingTools = ["Approved learner font", "Tenant font pack", "Hiragana-safe font", "Readable tile sizing", "Font rendering gate"];
const rowActions = ["Audio cue required", "Image upload blocked", "Reorder item", "Duplicate item", "Delete item"];
const blockedActions = [
  "No live file picker",
  "No Done-to-student route",
  "No direct AI publish",
  "No unreviewed image activation",
  "No support-language progress trigger",
  "No template switch without compatibility check",
];

export function TeacherDraftContentEntryWorkbenchPreview({ draft }: TeacherDraftContentEntryWorkbenchPreviewProps) {
  const previewRows = draft.vocabularyDraft.slice(0, 4).map((term, index) => ({
    id: `${term}-${index}`,
    front: term,
    back: draft.targetSentenceDrafts[index % draft.targetSentenceDrafts.length],
    audioStatus: index === 0 ? "Existing cue review" : "Audio regeneration required",
  }));

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Draft content-entry workbench preview</p>
          <h3 className="mt-1 text-lg font-bold">Teacher row editor surface</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This disabled workbench previews the future authoring panel shape. It shows title, instructions, sided rows, audio cues, image upload positions, formatting, and row actions without saving, uploading, assigning, or publishing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Preview only" tone="warning" />
          <StatusPill label="Draft persistence required" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
              Activity title
              <input
                value={draft.label}
                readOnly
                className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--tenant-text)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
              + Instruction
              <input
                value="Tap each card. Listen and repeat before the next game unlocks."
                readOnly
                className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--tenant-text)]"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--tenant-border)] bg-white px-3 py-1 text-xs font-bold text-[var(--tenant-text)]">
              Single sided
            </span>
            <span className="rounded-full border border-[var(--tenant-border)] bg-white px-3 py-1 text-xs font-bold text-[var(--tenant-text)]">
              Double sided
            </span>
            <span className="rounded-full border border-[var(--tenant-border)] bg-white px-3 py-1 text-xs font-bold text-[var(--tenant-text)]">
              min 2 max 50
            </span>
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Top actions</p>
          <div className="mt-3 grid gap-2">
            <button type="button" disabled className="min-h-10 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 text-left text-sm font-bold text-[var(--tenant-text)]">
              Generate With AI blocked
            </button>
            <button type="button" disabled className="min-h-10 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 text-left text-sm font-bold text-[var(--tenant-text)]">
              Flip tiles preview
            </button>
            <button type="button" disabled className="min-h-10 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 text-left text-sm font-bold text-[var(--tenant-text)]">
              Cross-game upload guide
            </button>
            <button type="button" disabled className="min-h-10 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 text-left text-sm font-bold text-[var(--tenant-text)]">
              Done blocked
            </button>
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-base font-bold text-[var(--tenant-text)]">Row editor draft</h4>
          <StatusPill label={`${previewRows.length} preview rows`} tone="neutral" />
        </div>

        <div className="mt-4 grid gap-3">
          {previewRows.map((row, index) => (
            <article key={row.id} className="grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 lg:grid-cols-[2rem_1fr_1fr_1.2fr]">
              <div className="text-sm font-bold text-[var(--tenant-muted)]">{index + 1}.</div>
              <DraftField label="Front" value={row.front} />
              <DraftField label="Back" value={row.back} />
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{row.audioStatus}</p>
                <div className="flex flex-wrap gap-2">
                  {rowActions.map((action) => (
                    <button key={action} type="button" disabled className="rounded-lg border border-[var(--tenant-border)] bg-white px-2 py-1 text-xs font-semibold text-[var(--tenant-muted)]">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {formattingTools.map((tool) => (
            <button key={tool} type="button" disabled className="rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--tenant-text)]">
              {tool}
            </button>
          ))}
          {fontRenderingTools.map((tool) => (
            <button key={tool} type="button" disabled className="rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--tenant-text)]">
              {tool}
            </button>
          ))}
          <button type="button" disabled className="rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--tenant-text)]">
            + Add an item
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">Blocked workbench shortcuts</h4>
          <StatusPill label={String(blockedActions.length)} tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
          {blockedActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function DraftField({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
      {label}
      <input
        value={value}
        readOnly
        className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--tenant-text)]"
      />
    </label>
  );
}
